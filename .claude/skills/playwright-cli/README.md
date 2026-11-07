# Playwright CLI — ChatGPT/Coding Agent skill

This ZIP contains one portable skill (`SKILL.md`, metadata, reference workflows and an environment doctor). The Microsoft browser binary and the CLI are **not** bundled; install @playwright/cli separately in an environment with Node.js 18+ and terminal access.

## Set up

```bash
npm install -g @playwright/cli@latest
playwright-cli --help
python playwright-cli/scripts/doctor.py
```

Then import/upload the unzipped `playwright-cli` folder through a compatible Skills manager. Browser operation is only possible in supported environments with terminal/browser permissions. The instructions do not grant shell or network privileges.

Source: https://github.com/microsoft/playwright-cli (Apache-2.0).
