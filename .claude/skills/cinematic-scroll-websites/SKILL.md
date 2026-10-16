---
name: cinematic-scroll-websites
description: Build premium cinematic, scroll-driven portfolio and agency websites in Claude Code, especially fixed centered laptop showcases whose screen changes between projects as side copy animates with scroll. Use when asked to recreate a website from a video, images or Figma references; implement scroll storytelling, pinned product showcases, GSAP ScrollTrigger transitions, or polished responsive interactive landing pages.
---

# Cinematic Scroll Websites

Build a **working, responsive website**, not a static mockup. Use the user's video, images, Figma design, and brand assets as the source of truth; do not claim placeholder projects are real client work.

## Workflow

1. **Inspect before coding.** Identify repository framework, scripts, existing design system, asset paths and project conventions. Preserve existing work; do not overwrite without need. Review supplied video by inspecting key frames and motion sequence; identify what moves and what stays fixed. If a video cannot be inspected, say so and use provided stills and instructions rather than inventing motion details.
2. **Confirm the core interaction.** For the Fary Labs reference pattern: one centered laptop is visually stationary throughout the pinned story; its **screen content** transitions across GREENADE, SIMPLY MILK, SYNTHA-6, DEPTHFIELD and optionally a final dashboard. Text to its left and right changes with scroll. Do not render one laptop per section or move the laptop between scenes. Other projects may use different fixed objects; adapt to the user's intent.
3. **Asset inventory.** Map provided screenshots to scene IDs. Use real supplied image files when authorized. Never substitute fabricated client projects; use placeholders visibly labeled as demo when assets are missing. For a laptop mockup, prefer a transparent frame asset with a precisely masked screen slot; if the frame is a flat screenshot, isolate its screen area carefully or construct a CSS/SVG laptop with one stable frame.
4. **Implement** in the existing stack when possible. For a new React site, prefer Next.js + TypeScript + Tailwind + GSAP/ScrollTrigger. Lenis is optional; only add it if it does not conflict with native scroll, accessibility, or ScrollTrigger. Consult [references/motion-architecture.md](references/motion-architecture.md).
5. **Visual language.** Follow references: Fary Labs uses generous whitespace, black editorial typography, grayscale surfaces, restrained accents from each showcased project, short headlines, little decorative copy, and consistent logo. Favor polished hierarchy over numerous cards or subtitles. Keep the word “digitales” black when recreating the user's established hero.
6. **Responsive and accessible.** On desktop: centered laptop with text in side columns; on mobile: centered laptop and readable text stacked around it, with adapted pin duration or a simpler sequential layout. Respect `prefers-reduced-motion`, keyboard access, contrast, semantic landmarks and meaningful alt text.
7. **Verify.** Run install/build/lint or project checks where available, inspect desktop and mobile rendering, test forward/backward scroll, resize, touch scrolling, image loading and reduced motion. Fix layout shifts, clipped content, overlaps, scroll-jacking and cleanup issues. Do not report tests as passed unless executed.
8. **Deliver.** Summarize changed files, how to run locally, what assets were used or are missing, and how to change projects and text. If user requested only a prompt, deliver a copy-ready Claude Code prompt instead of claiming implementation.

## Required animation behavior

- Use one `position: sticky`/GSAP-pinned storytelling stage and one persistent laptop shell.
- Create a timeline driven by ScrollTrigger `scrub` with explicit scene boundaries; screen layers are absolutely positioned and clipped to the laptop screen.
- Fade/reveal project images in the screen only; synchronize left/right content via timeline labels. Use transforms and opacity, avoid animating layout geometry.
- Preload or decode key images before transitioning; keep consistent aspect ratio with `object-fit` and an intentional focal point.
- Support scrolling in both directions. Cleanup with `gsap.context(...).revert()` in React effect teardown. Refresh ScrollTrigger after media loads or responsive layout changes.
- Avoid mixing multiple competing smooth-scroll engines. Never animate the laptop's top/left coordinates scene-to-scene unless explicitly requested.
- Include a closing section after unpinning with a real CTA (link/contact route), not a dead button.

## Example brief (Fary Labs)

- Hero: Fary Labs logo, navigation, headline “Transformamos ideas en productos digitales.”, black CTA, GREENADE inside the laptop.
- Scene 01: GREENADE — “Diseño web que impacta.”
- Scene 02: SIMPLY MILK — “Diseños que cuentan historias.”
- Scene 03: SYNTHA-6 — “Experiencias digitales a medida.”
- Scene 04: DEPTHFIELD — “Tecnología que impulsa.”
- Scene 05: Optional Fary Labs dashboard — “Construimos el futuro digital.”
- End: dark section “¿Listo para crear lo próximo?” and “Comenzar proyecto”.

Treat these as **illustrative content**, not a mandatory brand or universal scene list. Use the user's latest instructions to override any defaults.

## Quality gate

Reject the implementation if it shows multiple separate laptops, the central laptop jumps between scenes, screenshots overflow the screen bezel, side text overlaps the device, scene transitions pop abruptly, mobile horizontal overflow occurs, or scroll interaction breaks when reversing direction.
