#!/usr/bin/env python3
"""Inspección heurística local y solo lectura de patrones de riesgo.

No realiza peticiones de red, no ejecuta el proyecto, no imprime valores encontrados
ni sustituye una auditoría profesional. Acepta únicamente un directorio local.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SKIP_DIRS = {
    ".git", ".next", ".nuxt", ".svelte-kit", "node_modules", "dist", "build",
    "coverage", ".venv", "venv", "__pycache__", ".pytest_cache", "vendor",
}
SCANNABLE_SUFFIXES = {
    ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".py", ".go", ".rs",
    ".java", ".php", ".rb", ".vue", ".svelte", ".html", ".yaml", ".yml",
    ".json", ".toml", ".cfg", ".ini", ".sh", ".env.example",
}
MAX_FILES = 10000
MAX_FILE_BYTES = 1_000_000

RULES = [
    (
        "TLS_VERIFICATION_DISABLED", "Alta",
        r"(?i)(?:verify\s*=\s*False|rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['\"]?0)",
        "Posible desactivación de verificación de TLS. Confirmar contexto y eliminar bypass.",
    ),
    (
        "BROWSER_TOKEN_STORAGE", "Media",
        r"(?i)(?:localStorage|sessionStorage)\s*\.\s*setItem\s*\(\s*['\"][^'\"]*(?:access.?token|refresh.?token|auth.?token|password|secret)[^'\"]*['\"]",
        "Posible almacenamiento de credencial sensible en Web Storage. Revisar arquitectura de sesiones.",
    ),
    (
        "HTML_INJECTION_SINK", "Media",
        r"(?:dangerouslySetInnerHTML|\.\s*innerHTML\s*=|v-html\s*=)",
        "Punto que inserta HTML dinámico. Revisar origen y sanitización, sin asumir XSS.",
    ),
    (
        "DYNAMIC_CODE_EXECUTION", "Media",
        r"(?i)(?:\beval\s*\(|\bnew\s+Function\s*\()",
        "Ejecución dinámica de código potencialmente peligrosa. Verificar necesidad y confianza de la entrada.",
    ),
    (
        "POSSIBLE_LITERAL_CREDENTIAL", "Alta",
        r"(?i)\b(?:api[_-]?secret|secret[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password)\b\s*[:=]\s*['\"][^'\"]{8,}['\"]",
        "Posible credencial literal. Verificar sin divulgar valor; si es real, revocar y rotar.",
    ),
    (
        "BROAD_CORS", "Media",
        r"(?i)(?:Access-Control-Allow-Origin\s*[:=]\s*['\"]?\*|origin\s*:\s*['\"]\*['\"])",
        "Posible CORS permisivo. Revisar si la ruta usa credenciales y limitar orígenes.",
    ),
    (
        "PUBLIC_ENV_SECRET_NAME", "Media",
        r"\b(?:VITE|NEXT_PUBLIC|REACT_APP)_[A-Z0-9_]*(?:SECRET|PRIVATE_KEY|ACCESS_TOKEN|REFRESH_TOKEN)[A-Z0-9_]*\b",
        "Variable de frontend cuyo nombre sugiere un secreto. Verificar que no sea privada.",
    ),
]
COMPILED_RULES = [(name, severity, re.compile(pattern), explanation) for name, severity, pattern, explanation in RULES]


def audit(root: Path) -> dict:
    results = []
    stats = {"files_examined": 0, "files_skipped_too_large": 0, "files_unreadable": 0}
    if not root.is_dir():
        raise ValueError("Se requiere una carpeta local existente")
    for path in root.rglob("*"):
        if any(segment in SKIP_DIRS for segment in path.relative_to(root).parts):
            continue
        if not path.is_file():
            continue
        rel_path = path.relative_to(root).as_posix()
        if path.name.startswith(".env") and path.name not in {".env.example", ".env.sample"}:
            results.append({
                "rule": "ENV_FILE_PRESENT", "severity": "Baja", "path": rel_path,
                "line": None,
                "guidance": "Revisar exclusión del repositorio, permisos y gestión segura de variables; no se leyó el archivo.",
            })
            continue
        if path.suffix not in SCANNABLE_SUFFIXES and path.name not in {"Dockerfile", "Caddyfile", ".env.example", ".env.sample"}:
            continue
        try:
            if path.stat().st_size > MAX_FILE_BYTES:
                stats["files_skipped_too_large"] += 1
                continue
            content = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            stats["files_unreadable"] += 1
            continue
        stats["files_examined"] += 1
        for line_number, line in enumerate(content.splitlines(), start=1):
            for rule, severity, regex, guidance in COMPILED_RULES:
                if regex.search(line):
                    results.append({
                        "rule": rule,
                        "severity": severity,
                        "path": rel_path,
                        "line": line_number,
                        "guidance": guidance,
                    })
        if stats["files_examined"] >= MAX_FILES:
            break
    return {
        "tool": "audit_local",
        "mode": "solo-lectura; sin red; heurístico",
        "stats": stats,
        "findings": results,
        "limitations": [
            "No se ejecutan pruebas dinámicas ni se consulta a terceros.",
            "Un patrón encontrado no demuestra por sí solo una vulnerabilidad.",
            "Una ausencia de hallazgos no significa que la aplicación sea segura.",
            "No se incluyen coincidencias ni valores de secretos en el informe.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_dir", help="Ruta de la carpeta del proyecto propio")
    args = parser.parse_args()
    root = Path(args.project_dir).expanduser().resolve()
    try:
        report = audit(root)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
