# Applying brand DESIGN.md files

## Picking styles by brief

- Dark and premium SaaS: `linear.app`, `vercel`, `raycast`, `sanity`.
- Warm/humanist AI and editorial: `claude`, `cursor`, `lovable`, `elevenlabs`.
- Financial/data-dense: `stripe`, `coinbase`, `wise`, `kraken`.
- Visual commerce: `nike`, `airbnb`, `shopify`, `apple`.
- Premium automotive minimalism: `tesla`, `bugatti`, `ferrari`.
- Friendly automation/productivity: `zapier`, `slack`, `notion`.

A single color is not a design system. Full `DESIGN.md` files describe component states, typography, density, responsive behavior and elevation.

## Implementation

1. Read the current project architecture, components and CSS conventions.
2. Use the selected brand's full spec to define semantic tokens; differentiate brand colors from semantic interface roles.
3. Establish typography fallbacks; branded or proprietary fonts cannot be assumed licensed.
4. Implement button, input, card, nav, section spacing and state rules consistently.
5. Evaluate at mobile and desktop breakpoints, keyboard focus and screen reader labels.
6. Compare the result with the source file and document intentional deviations.

## Example prompts

- "Build a Linear-inspired admin dashboard while preserving the existing data model."
- "Use Stripe's DESIGN.md for a fintech hero; derive tokens and components."
- "Generate a standalone DESIGN.md for my brand based on the attached identity guide."

## Source and permissions

- Upstream reference collection: https://github.com/VoltAgent/awesome-design-md
- Index inspiration: https://github.com/arumwu/design-md-skill
- Both repositories publish under MIT; check the upstream repository for the complete license notices.
- The representations are inspired design analyses, not official brand authorizations.
