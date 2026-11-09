# Integration patterns for Base44

## Scope verification
A Base44 project can be edited in its platform UI or managed as source with its CLI. Verify React build, router and package availability on the actual app. The Base44 JavaScript SDK does NOT supply an animation engine; avoid changing SDK wiring.

## CSS baseline
Import `premium-motion.css` once from an existing global stylesheet or shell entrypoint. Apply `pm-enter` to first-view content; use `pm-stagger` only for a small set of above-the-fold blocks with inline `--pm-index` values 0..7. Wrap cards/interactive controls with `pm-interactive` only when this doesn't conflict with existing transform-based styling.

## React integration
Use `PremiumMotion.jsx` only if npm Motion is available (`motion/react`) or adapt to an existing `framer-motion` dependency. Do not install both. `AppEntrance` belongs on the initial shell content and should not remount on every query state change. `PagePresence` must sit above the rendered routed page, at a location that persists across navigation. Use actual router location + a page child derived from that location. Verify that the router does not replace the containing Layout before the exit phase.

`AnimatePresence mode="wait"` ensures exit finishes before entry in controlled SPA navigation but can add 130-240ms perceived latency: avoid it for high-frequency tabs, form steps, or operations that need immediate content. In those cases use `mode="sync"` or CSS-first entry only. Do not force route changes to await animation artificially.

## App close semantics
There are three distinct scenarios:
1. Dismiss an in-app dialog/sidebar: animate controlled mounting/unmounting with presence-aware component.
2. Navigate between SPA pages: animate a keyed route view if a stable router outlet exists.
3. Close tab, browser, native app, or navigate outside the origin: cannot reliably hold or animate browser lifecycle; do not claim otherwise.

## Interactive conventions
- Button: 130ms press scale 0.985; pointer hover lift max 2px; always focus-visible.
- Panel or modal: 160-220ms opacity/translate (reduce off); focus trap and restore focus to opener.
- Toast: 150-240ms gentle enter/exit; `role=status` for noncritical updates.
- Card reveal: 240-380ms; 50-65ms stagger, max 8 high-priority siblings.
- Navigation: enter 180-260ms, exit 100-180ms, translate 6-12px.
- Skeleton/content: avoid duplicate reveal; never animate loading forever without a meaningful status.

## Practical performance
Favor compositor-friendly opacity/transform. Profile on mobile in Chrome Performance, devtools Rendering FPS, and performance timelines. Measure p95 frame time <=16.7ms in target 60Hz interactions where practical. Additional slow devices may not meet goal; improve rendering and network behavior rather than masking them with animations. Respect `prefers-reduced-motion` before applying initial hidden states.
