# playwright-cli command reference

These are representative commands from the official Microsoft Playwright CLI, not a guaranteed list for every installed version. Always inspect `playwright-cli --help` for flags and current availability.

## Install / inspect

```bash
node --version
npm install -g @playwright/cli@latest
playwright-cli --help
# Or, as a local project dependency:
npm install -D @playwright/cli@latest
npx playwright cli --help
```

## Open and navigate

```bash
playwright-cli open
playwright-cli open https://example.com/ --headed
playwright-cli goto https://example.com/
playwright-cli reload
playwright-cli go-back
playwright-cli go-forward
playwright-cli close
```

## Snapshots, finding, elements

```bash
playwright-cli snapshot
playwright-cli snapshot --filename=initial.yaml
playwright-cli snapshot --depth=4
playwright-cli find "Sign in"
playwright-cli find --regex "/sign (in|up)/i"
playwright-cli click e15
playwright-cli dblclick e2
playwright-cli fill e3 "user@example.com"
playwright-cli fill e3 "hello" --submit
playwright-cli type "some text"
playwright-cli press Enter
playwright-cli check e4
playwright-cli uncheck e4
playwright-cli select e5 "option-value"
playwright-cli hover e6
playwright-cli upload ./document.pdf
```

`e15` etc. are illustrative refs only. Read the latest snapshot before using them. Refs may change after a re-render. If necessary, use a Playwright role or test-ID selector such as `getByRole('button', { name: 'Submit' })`.

## Screenshots, output, DOM inspection

```bash
playwright-cli screenshot
playwright-cli screenshot --filename=page.png
playwright-cli screenshot e7
playwright-cli screenshot --hires
playwright-cli pdf --filename=page.pdf
playwright-cli eval "document.title"
playwright-cli eval "el => el.textContent" e5
playwright-cli --raw eval "JSON.stringify([...document.querySelectorAll('a')].map(a => a.href))"
playwright-cli --raw snapshot > snapshot.yml
```

## Debugging, sessions, tabs

```bash
playwright-cli console
playwright-cli console warning
playwright-cli requests
playwright-cli request 5
playwright-cli tab-list
playwright-cli tab-new https://example.com/
playwright-cli tab-select 0
playwright-cli tab-close
playwright-cli -s=qa open https://example.com/
playwright-cli -s=qa close
playwright-cli list
playwright-cli close-all
```

## Device and visual behavior

```bash
playwright-cli open --mobile
playwright-cli open --device="iPhone 15"
playwright-cli resize 390 844
playwright-cli set-color-scheme dark
playwright-cli clear-color-scheme
playwright-cli set-reduced-motion reduce
playwright-cli clear-reduced-motion
```

## State, network and tracing

```bash
playwright-cli state-save auth.json
playwright-cli state-load auth.json
playwright-cli cookie-list
playwright-cli localstorage-list
playwright-cli route "**/*.jpg" --status=404
playwright-cli route-list
playwright-cli unroute "**/*.jpg"
playwright-cli tracing-start
playwright-cli tracing-stop
playwright-cli recording-start
playwright-cli recording-stop
```

Treat saved auth JSON, cookies, local storage and downloaded reports as sensitive.

## Practical troubleshooting

- `command not found`: confirm Node/npm availability, global PATH, or use local `npx playwright cli`.
- Browser not installed: follow Playwright's browser install instructions/error output.
- `Element not found` / stale ref: run `snapshot` and resolve a new ref.
- A new tab or popup appeared: run `tab-list`, choose it using `tab-select` and snapshot again.
- Authentication or 2FA: involve the user; do not bypass authentication.
- Shell quoting: quote URLs with `&`; on Windows `cmd.exe`, use `^&` where necessary.
- `--raw` is useful for piping output; `--json` offers structured CLI output when supported.
