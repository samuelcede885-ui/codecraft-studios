#!/usr/bin/env python3
"""Check host prerequisites for the external playwright-cli executable."""
import json
import shutil
import subprocess
import sys


def probe(command, args):
    found = shutil.which(command)
    if not found:
        return {"available": False, "path": None, "output": "not found in PATH"}
    try:
        result = subprocess.run([found, *args], capture_output=True, text=True, timeout=15, check=False)
        return {"available": result.returncode == 0, "path": found,
                "output": (result.stdout or result.stderr).strip().splitlines()[0][:240] if (result.stdout or result.stderr).strip() else ""}
    except (OSError, subprocess.TimeoutExpired) as exc:
        return {"available": False, "path": found, "output": str(exc)}


def main():
    results = {
        "node": probe("node", ["--version"]),
        "npm": probe("npm", ["--version"]),
        "playwright-cli": probe("playwright-cli", ["--help"]),
    }
    print(json.dumps(results, indent=2, ensure_ascii=False))
    if not results["playwright-cli"]["available"]:
        print("Install with: npm install -g @playwright/cli@latest", file=sys.stderr)
        print("A Playwright browser installation may also be required.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
