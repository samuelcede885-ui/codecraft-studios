# Awesome DESIGN.md — ChatGPT/Coding Agent skill

This ZIP contains one portable skill (`SKILL.md` plus metadata, a catalog of 74 brands, a helper script and a blank template). It is **not** an offline copy of all 74 upstream brand documents. With network access the helper downloads an upstream DESIGN.md on demand; offline mode can use a local clone.

## Use

Unzip `skill.zip`, import/upload the `awesome-design-md` skill folder in a compatible Skills manager, then ask for a UI matching a brand. In a shell:

```bash
python awesome-design-md/scripts/design_md.py --list
python awesome-design-md/scripts/design_md.py --brand linear --info
python awesome-design-md/scripts/design_md.py --brand stripe --project ./my-project
```

The last command requires either internet access or an existing local VoltAgent library. It will not overwrite an existing DESIGN.md without `--force`.

Source: https://github.com/VoltAgent/awesome-design-md (MIT). The catalog is a convenience index, not official brand documentation. No proprietary font or brand assets are included.
