#!/usr/bin/env python3
"""Select and download a verified brand DESIGN.md to a project.

No third-party dependencies. Full brand specifications are fetched from the
VoltAgent/awesome-design-md MIT repository or read from a local checkout.
"""
import argparse
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
import urllib.error
import urllib.request

SKILL_ROOT = Path(__file__).resolve().parent.parent
CATALOG = SKILL_ROOT / "references" / "catalog.json"
RAW_PREFIX = "https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/"
MAX_BYTES = 3 * 1024 * 1024
ALIASES = {
    "linear": "linear.app", "linearapp": "linear.app", "xai": "x.ai",
    "x ai": "x.ai", "mistral": "mistral.ai", "together": "together.ai",
    "opencode": "opencode.ai", "the verge": "theverge", "verge": "theverge",
    "bmw m": "bmw-m", "bmwm": "bmw-m", "dell 1996": "dell-1996",
    "nintendo 2001": "nintendo-2001", "play station": "playstation",
}


def read_catalog():
    obj = json.loads(CATALOG.read_text(encoding="utf-8"))
    return {record[0]: (category, record[1], record[2])
            for category, records in obj.items() for record in records}


def slug_for(name, all_brands):
    key = name.lower().strip()
    key = ALIASES.get(key, key)
    if key not in all_brands:
        raise ValueError(f"Unknown brand {name!r}; use --list to see supported brands")
    return key


def looks_like_design_md(blob):
    if not isinstance(blob, bytes) or len(blob) < 40 or len(blob) > MAX_BYTES:
        return False
    try:
        content = blob.decode("utf-8")
    except UnicodeError:
        return False
    return ("#" in content and ("colors" in content.lower() or "color" in content.lower())
            and ("typography" in content.lower() or "font" in content.lower()))


def local_paths(slug, library=None):
    dirs = []
    if library:
        dirs.append(Path(library).expanduser())
    if os.environ.get("DESIGN_MD_DIR"):
        dirs.append(Path(os.environ["DESIGN_MD_DIR"]).expanduser())
    dirs.extend([
        Path.cwd() / "awesome-design-md", Path.home() / "Developer" / "awesome-design-md",
        Path.home() / "dev" / "awesome-design-md", Path.home() / "awesome-design-md",
        Path.home() / ".cache" / "awesome-design-md",
    ])
    for base in dirs:
        yield base / "design-md" / slug / "DESIGN.md"
        yield base / slug / "DESIGN.md"


def get_design(slug, offline=False, library=None, cache=True):
    for candidate in local_paths(slug, library):
        if candidate.is_file():
            contents = candidate.read_bytes()
            if looks_like_design_md(contents):
                return contents, str(candidate)
    if offline:
        raise RuntimeError("No valid local reference for this brand; --offline forbids network fetching")
    url = RAW_PREFIX + slug + "/DESIGN.md"
    req = urllib.request.Request(url, headers={"User-Agent": "awesome-design-md-skill/1.0", "Accept": "text/plain"})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            data = response.read(MAX_BYTES + 1)
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as exc:
        raise RuntimeError(f"Could not fetch {url}: {exc}") from exc
    if not looks_like_design_md(data):
        raise RuntimeError(f"Fetched invalid or oversized DESIGN.md from {url}")
    if cache:
        out = Path.home() / ".cache" / "awesome-design-md" / "design-md" / slug / "DESIGN.md"
        try:
            atomic_write(out, data, replace=True)
        except OSError:
            pass  # Read-only cache is fine; return the fetched data.
    return data, url


def atomic_write(path, contents, replace=False):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and not replace:
        raise FileExistsError(f"Target already exists: {path}. Use --force to replace intentionally")
    with tempfile.NamedTemporaryFile(dir=path.parent, prefix=".DESIGN-", suffix=".tmp", delete=False) as file:
        temp = Path(file.name)
        file.write(contents)
    try:
        if path.exists() and not replace:
            raise FileExistsError(f"Target already exists: {path}")
        os.replace(temp, path)
    finally:
        temp.unlink(missing_ok=True)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--list", action="store_true", help="List all supported brand slugs")
    parser.add_argument("--brand", help="Brand slug or a supported alias")
    parser.add_argument("--info", action="store_true", help="Show brand metadata without fetching")
    parser.add_argument("--print", dest="to_stdout", action="store_true", help="Print full DESIGN.md to stdout")
    parser.add_argument("--project", help="Project directory where DESIGN.md will be placed")
    parser.add_argument("--library", help="Directory of a local checkout of VoltAgent/awesome-design-md")
    parser.add_argument("--offline", action="store_true", help="Forbid remote downloads")
    parser.add_argument("--force", action="store_true", help="Overwrite existing project DESIGN.md")
    args = parser.parse_args(argv)

    catalog = read_catalog()
    if args.list:
        for slug, (category, color, mood) in catalog.items():
            print(f"{slug:16} {color:8} {category:34} {mood}")
        print(f"\n{len(catalog)} supported brands")
        return 0
    if not args.brand:
        parser.error("--brand is required unless --list is given")
    try:
        slug = slug_for(args.brand, catalog)
        category, color, mood = catalog[slug]
        if args.info:
            print(json.dumps({"slug": slug, "category": category, "index_color": color,
                              "style": mood, "full_design_bundled": False}, indent=2))
            return 0
        if not (args.to_stdout or args.project):
            parser.error("Specify --print or --project, or use --info")
        target = Path(args.project).expanduser().resolve() / "DESIGN.md" if args.project else None
        if target and target.exists() and not args.force:
            raise FileExistsError(f"Existing DESIGN.md at {target}. Aborting; specify --force only if approved")
        contents, source = get_design(slug, offline=args.offline, library=args.library)
        if args.to_stdout:
            print(contents.decode("utf-8"))
        if target:
            atomic_write(target, contents, replace=args.force)
            print(f"Wrote {target} from {source}", file=sys.stderr)
        return 0
    except (ValueError, RuntimeError, OSError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
