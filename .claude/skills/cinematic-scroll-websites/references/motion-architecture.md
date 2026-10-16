# Motion architecture for pinned laptop storytelling

## Structure

- `Showcase` owns the scroll container with a sticky/pinned viewport.
- `LaptopShell` is rendered **once** and never remounted across scene changes.
- `ScreenSlides` contains stacked absolutely positioned `<img>` layers, clipped by a stable screen mask.
- `StoryCopy` has left/right layers synchronized with scene labels.
- `scenes.ts` is the editable data source (`id`, `image`, `alt`, `title`, `description`, `features`, `accent`).

## GSAP implementation outline

In a client component, register ScrollTrigger once. In `useLayoutEffect`, create a `gsap.context` scoped to the stage. Set the first slide and first text group visible. Build one timeline with `scrollTrigger: { trigger: stage, start: 'top top', end: () => '+=' + sceneCount * window.innerHeight * 0.9, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }`. At each scene boundary crossfade the outgoing/incoming screen layers and matching text layers; do not animate the laptop shell position. Return `() => ctx.revert()`.

Avoid accidentally overlapping the last scene's exit with the next scene's entrance. Use timeline labels and explicit positions; inspect both forward and reverse motion. For React Strict Mode, avoid leaked triggers and duplicated pin spacers.

If using Lenis, drive GSAP's ticker correctly and update ScrollTrigger on Lenis scroll. Prefer native scrolling if this integration is unnecessary.

## Device mockup

A CSS/SVG laptop is acceptable when no clean device PNG exists. Use one outer frame with stable dimensions and a separate inset screen region with `overflow: hidden`, border radius and clipping. Never put the entire screenshot of a laptop inside another laptop. Perspective transforms must apply consistently to frame and masked screen if the laptop is angled.

## Responsive behavior

Desktop layout may use a 3-column grid (left story, center device, right features) with center width prioritized. On small screens, use a single column, reduce text length and consider disabling pinning if the viewport is too short. Keep all interactive elements usable.

## Testing checklist

- Images load without flicker, wrong aspect ratio, or visible edges.
- Scroll forward and backward reaches every scene.
- Device stays stationary within the pinned stage.
- Last scene unpins into final CTA naturally.
- No console errors or hydration warnings.
- 360px mobile, tablet, 1440px desktop and reduced-motion behavior are checked.
- No fake claims about project ownership or fabricated metrics.
