# Bonsai Retro Tactile Design System

This document reflects the current production visual language used across the Bonsai landing site. It is no longer a pure soft-clay system. The current direction is a hybrid of:

- claymorphism
- skeuomorphic depth
- iOS 6 era tactile surfaces
- retro physical-computing cues

The goal is simple: interfaces should feel pressable, slightly toy-like, and materially believable without becoming a novelty redesign.

## 1. Design Intent

The system should feel like:

- a next-generation product presented through retro physical controls
- raised buttons, machine panels, drawers, lights, rails, and dials
- matte surfaces with a controlled highlight, not glossy plastic
- dense enough to feel crafted, restrained enough to stay commercial

The system should avoid:

- flat modern SaaS minimalism
- generic purple gradients
- oversized shadows with no physical logic
- decorative visuals that do not explain the product

## 2. Core Principles

### 2.1 Physical Logic
Every raised element needs three layers:

1. top surface
2. hard edge or thickness layer
3. soft ambient shadow

Pressed states must remove the hard edge and travel downward by the same amount.

### 2.2 Matte, Not Glossy
Highlights are subtle and mostly internal. Surfaces should feel worn-in and tactile, like a well-made computer key, not like polished candy.

### 2.3 Dark Shell, Light Instruments
The site uses a dark textured chassis for the page and header, then places light panels and controls on top for contrast and legibility.

### 2.4 Explanatory Visuals
Custom visuals are not decoration. They should help users picture the action:

- messages entering from multiple channels
- AI classifying and routing
- humans coordinating on one thread

## 3. Typography

### Primary UI Font
- `"Helvetica Neue", Helvetica, Arial, sans-serif`

### Logo / Display Accent
- `"Futura-CondensedExtraBold", "Futura", "Trebuchet MS", sans-serif`

### Type Rules
- Headings: `600`
- Strong UI labels and buttons: `700`
- Dense micro-labels: `800` with uppercase tracking
- Dark backgrounds should usually use a negative text shadow

### Utility Text Styles
```css
.text-on-dark { color: var(--text-on-dark); text-shadow: 0 -1px 0 rgba(0,0,0,0.8); }
.text-muted { color: var(--text-muted-on-dark); text-shadow: 0 -1px 0 rgba(0,0,0,0.8); }
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
```

## 4. Color System

### Core Tokens
| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--primary-blue` | `#147EFB` | Brand blue |
| `--primary-blue-dark` | `#0060e0` | Stronger blue edge |
| `--primary-clay-surface` | `#2f8ef7` | Main raised button surface |
| `--primary-clay-edge` | `#0b63cb` | Hard shadow / thickness for blue controls |
| `--primary-clay-highlight` | `rgba(255,255,255,0.24)` | Soft internal lift |
| `--bg-dark` | `#3d3d3d` | Main page shell |
| `--bg-medium` | `#4a4a4a` | Secondary shell surface |
| `--surface-white` | `#ffffff` | Card body |
| `--border-gray` | `#c8c7cc` | Neutral border |
| `--text-primary` | `#1a1a1a` | Main text |
| `--text-secondary` | `#888888` | Secondary text |
| `--text-on-dark` | `#ffffff` | High-contrast dark-surface text |
| `--text-muted-on-dark` | `#c8c7cc` | Muted dark-surface text |
| `--danger-color` | `#e84040` | Error / urgency accent |
| `--success-color` | `#4cd964` | Positive accent |

### Supporting Palette Character
The site also uses muted industrial tints inside cards and visuals:

- slate blue-grays
- washed steel blues
- amber signal lights
- soft mint / green status accents
- warm grays in the shell and footer

## 5. Background Language

### Page Background
The body uses a dark crosshatch texture, not a flat fill:

```css
background-color: #3d3d3d;
background-image:
  repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0 2px, transparent 2px 4px),
  repeating-linear-gradient(-45deg, rgba(0,0,0,0.1) 0 2px, transparent 2px 4px);
background-size: 4px 4px;
```

### Shell Surfaces
Dark structural elements should combine:

- a matte dark base
- a subtle gradient
- a light amount of noise
- a restrained top highlight

## 6. Header / Shared Shell

The navbar is a fixed mechanical shell, not a transparent overlay.

### Header Characteristics
- fixed at top
- dark leather-like / machine-panel feel
- stitched thread detail at the bottom
- subtle inset highlight
- strong but compact depth

### Header Surface Recipe
```css
background-color: #3b3a36;
background-image:
  url(noise-texture),
  linear-gradient(to bottom, #504f4a 0%, #262523 100%);
border-bottom: 1px solid #141312;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 3px 6px rgba(0,0,0,0.6);
```

### Navigation Rules
- desktop links are simple and quiet
- the CTA in nav uses the full primary button language
- mobile drawer uses list-row links plus one full-width primary CTA
- language switcher should visually align with the CTA block height

## 7. Buttons

Buttons are the hero component in this system. They should feel like physical parts.

### 7.1 Primary Button

Use for:

- main CTA
- nav CTA
- pricing CTA
- any intentional action that should feel like pressing a key or block

### Default
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 14px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.24);
  color: #fff;
  font-weight: 700;
  line-height: 1.1;
  text-shadow: 0 -1px 0 rgba(0,0,0,0.32);
  background: linear-gradient(to bottom, #4199fb 0%, var(--primary-clay-surface) 100%);
  box-shadow:
    inset 0 1px 0 rgba(0,0,0,0.08),
    inset 0 2px 3px var(--primary-clay-highlight),
    inset 0 -1px 0 rgba(255,255,255,0.10),
    0 5px 0 var(--primary-clay-edge),
    0 9px 14px rgba(0,0,0,0.14);
  transition: all 0.1s ease-out;
}
```

### Hover
- subtle darkening only
- no dramatic glow
- keep the material feeling matte

```css
.btn-primary:hover {
  background: linear-gradient(to bottom, #3c90ee 0%, #2a84ec 100%);
}
```

### Pressed
The travel distance must match the hard edge height.

```css
.btn-primary:active,
.btn-primary.is-pressed {
  background: linear-gradient(to bottom, #2b85ee 0%, #1f73dc 100%);
  box-shadow:
    inset 0 1px 0 rgba(0,0,0,0.10),
    inset 0 1px 2px rgba(255,255,255,0.18),
    0 0 0 var(--primary-clay-edge),
    0 2px 4px rgba(0,0,0,0.10);
  transform: translateY(5px);
}
```

### Focus
```css
.btn-primary:focus-visible {
  outline: 3px solid rgba(118, 174, 255, 0.85);
  outline-offset: 2px;
}
```

### Button Personality Notes
- slightly taller than a standard web button
- centered text via `inline-flex`
- “lego block” chunkiness is intentional
- top surface has a tiny erosion / depression feel, not a glossy shine

### 7.2 Secondary Button

Use for:

- language switcher
- supporting actions
- menu toggle
- less-prominent calls to action

```css
.btn-secondary {
  background: linear-gradient(to bottom, #f0f0f0, #d8d8d8);
  border: 1px solid #b0b0b0;
  border-radius: 10px;
  min-height: 42px;
  padding: 11px 16px;
  color: #1a1a1a;
  text-shadow: 0 1px 0 rgba(255,255,255,0.8);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.3);
}
```

Pressed state:

```css
.btn-secondary:active,
.btn-secondary.is-pressed {
  background: linear-gradient(to bottom, #d0d0d0, #b8b8b8);
  box-shadow: inset 0 2px 3px rgba(0,0,0,0.3);
  transform: translateY(1px);
}
```

### 7.3 Tactile Interaction Rule

All buttons should support a JS-applied `.is-pressed` state on pointer down for touch devices. The pressed motion should feel immediate and mechanical, not springy.

## 8. Cards and Panels

Cards are raised instruments sitting on the dark shell.

### Base Card
```css
.card {
  background: var(--surface-white);
  border: 1px solid #d7d8de;
  border-radius: 12px;
  box-shadow:
    inset 0 2px 3px rgba(255,255,255,0.72),
    0 4px 0 rgba(184,188,202,0.9),
    0 10px 18px rgba(0,0,0,0.10);
  padding: 24px;
  overflow: hidden;
}
```

### Card Header
Use for sections that need a more productized panel look:

```css
.card-header {
  background: linear-gradient(to bottom, #fafbfc 0%, #eef1f5 100%);
  border-bottom: 1px solid #d9dde5;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.85);
}
```

### Card Tone
- soft white body
- hard bottom edge for lift
- restrained ambient shadow
- rounder corners than typical dashboard UI

## 9. Trust Bar

The trust bar is a compact raised tray placed under the hero.

### Container
```css
.trust-bar-shell {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 16px 22px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.14);
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.04)),
    rgba(0,0,0,0.18);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 6px 14px rgba(0,0,0,0.18);
}
```

### Channel Keys / Pills
Current production trust items are colorful tactile pills:

```css
.trust-text-pill {
  min-height: 42px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.22);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow:
    inset 0 2px 3px rgba(255,255,255,0.16),
    0 4px 0 rgba(18,24,41,0.24),
    0 10px 16px rgba(0,0,0,0.14);
}
```

Branded channel fills:

- WhatsApp: green
- Instagram: multicolor warm gradient
- Facebook: bright blue
- Email: slate gray-blue
- Telegram: cyan
- SMS: mustard amber

If reused elsewhere, these should evolve into tactile “channel keys,” not generic tags.

## 10. Custom Visual Panels

Visuals throughout the page share a common panel language.

### Shared Visual Container
```css
.feature-visual,
.ai-diagram,
.hiw-visual {
  position: relative;
  overflow: hidden;
}

.feature-visual {
  min-height: 280px;
  padding: 22px;
  border-radius: 22px;
  border: 1px solid #cfd6e3;
  background: linear-gradient(to bottom, #f8fbff 0%, #e9eef7 100%);
  box-shadow:
    inset 0 2px 3px rgba(255,255,255,0.82),
    0 5px 0 rgba(182,191,208,0.95),
    0 16px 26px rgba(0,0,0,0.10);
}
```

### Texture Overlay
Use a subtle halftone / highlight overlay:

```css
::before {
  background:
    radial-gradient(circle at 18% 20%, rgba(255,255,255,0.14) 0 2px, transparent 2px) 0 0/16px 16px,
    linear-gradient(135deg, rgba(255,255,255,0.08), transparent 42%);
}
```

### Inner Frame
Use a quiet inset outline to make the panel feel manufactured:

```css
::after {
  inset: 10px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.14);
}
```

### Signal Details
Reusable details include:

- status lights
- rails
- message cards
- drawers
- post-it notes
- screen windows
- routing branches
- instrument ribbons

These details should support explanation first and style second.

## 11. Feature Section Composition

The feature section uses paired explanatory modules:

- story card
- visual panel
- alternating layout by row

### Layout
```css
.feature-pair-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 30px;
  align-items: center;
}
```

### Mobile Rule
On mobile, each feature should flow:

1. card
2. visual
3. next card
4. next visual

This improves comprehension versus grouping all text first and all visuals later.

## 12. AI / Workflow Visual Language

When building product explainer visuals, prefer tangible metaphors:

- intake cards for messages
- rails or channels for movement
- router / brain nodes for AI decisions
- labeled outcomes like “responds solo” or “escalates with context”
- internal note and assignment blocks for team coordination

Avoid:

- fake dashboard screenshots
- meaningless charts
- abstract blobs

## 13. Hero Media Frame

Hero media should sit in a darker recessed screen frame:

```css
.hero-image-placeholder {
  background: rgba(0,0,0,0.4);
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 2px 4px rgba(255,255,255,0.05);
}
```

This makes the media feel embedded in a device rather than floating on the page.

## 14. Responsive Behavior

### Mobile Navbar
- fixed shell remains in place
- language switcher and hamburger stay on one row
- drawer opens as a full-width stacked list
- final item becomes a full-width primary CTA

### Mobile Buttons
- keep tactile press feedback
- suppress desktop-like sticky hover behavior on touch devices
- preserve chunky height and centered text

### Mobile Sections
- tighter vertical spacing
- preserve panel depth, but reduce layout complexity
- avoid tiny side-by-side visuals unless they remain clearly readable

## 15. Accessibility and Interaction

### Focus
Always preserve a strong visible focus state on controls.

### Touch
- use `touch-action: manipulation`
- use `.is-pressed` to mirror desktop press feel
- avoid hover-only meaning

### Motion
Motion should feel mechanical and brief:

- short duration
- direct movement
- no floaty easing
- no decorative bounce by default

## 16. Reusable Recipes

### A. Raised Blue CTA
- blue top gradient
- slightly darker hard edge
- 12px radius
- 5px press depth
- matte top highlight

### B. Raised White Card
- white to cool white surface
- inner highlight
- gray hard edge
- soft drop shadow

### C. Machine Panel
- cool light background
- inner frame
- subtle texture
- lights / ribbon / controls as accents

### D. Dark Shell
- warm gray-black gradient
- noise texture
- top inset highlight
- stitching or seam when helpful

## 17. Implementation Notes

### Shadow Order Matters
For raised controls and cards, shadow layers should be declared in this order:

1. inset surface detail
2. hard edge / thickness
3. soft ambient depth

### Press Depth Must Match Edge Depth
If the hard edge is `5px`, the pressed transform should also be `translateY(5px)`.

### Keep the System Cohesive
If introducing a new component, ask:

- does it belong to the dark shell or the light instrument layer?
- should it feel raised, recessed, or embedded?
- what is the physical logic of its shadows?
- does it explain something or just decorate?

## 18. Suggested Component Map for Reuse

When porting this system into another surface, start with:

1. dark shell background
2. fixed mechanical header
3. primary and secondary buttons
4. raised cards
5. visual instrument panels
6. tactile trust/channel keys

That order gets most of the Bonsai feel quickly without recreating every bespoke illustration.
