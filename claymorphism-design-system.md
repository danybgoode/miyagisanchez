# Claymorphism 3D Tactile Design System

## 1. Typography
- **Font Stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Weights:** `400` (Regular), `600` (Semi-bold), `700` (Bold)
- **Default Text Color:** `var(--text-main)`

## 2. Color Palette
| Variable | Hex Value | Usage / Description |
| :--- | :--- | :--- |
| `--bg-color` | `#e8ebf2` | Main page background (soft grayish-blue) |
| `--surface-color` | `#f2f5f9` | Top surface of buttons, cards, navbars |
| `--bottom-edge` | `#c8cbe2` | 3D thickness layer (purplish bottom edge) |
| `--text-main` | `#818a9f` | Primary text (slate blue-gray) |
| `--highlight` | `#ffffff` | Inner top highlight for raised elements |

## 3. Component: Buttons (Primary Raised Clay)

### Default State
- **Background:** `var(--surface-color)`
- **Border:** `1px solid rgba(255, 255, 255, 0.6)`
- **Border Radius:** `12px`
- **Transition:** `all 0.1s ease-out`
- **Box Shadow (Stacked 3D Effect):**
  ```css
  inset 0 3px 4px var(--highlight),
  0 5px 0 var(--bottom-edge),
  0 10px 15px rgba(0, 0, 0, 0.08)
  ```

### Active / Pressed State
- **Transform:** `translateY(5px)`
- **Box Shadow:**
  ```css
  inset 0 2px 2px var(--highlight),
  0 0px 0 var(--bottom-edge),
  0 2px 4px rgba(0, 0, 0, 0.05)
  ```

### Variant: Keyboard Key (`.key-btn`)
- **Padding:** `12px 18px`
- **Font Size:** `20px`
- **Min-Width:** `60px`

## 4. Component: Containers

### Navbar (`.clay-navbar`)
- **Background:** `var(--surface-color)`
- **Padding:** `15px 30px`
- **Border Radius:** `20px`
- **Box Shadow:**
  ```css
  inset 0 3px 5px var(--highlight),
  0 4px 10px rgba(0, 0, 0, 0.05)
  ```

### Main Card (`.clay-container`)
- **Background:** `var(--surface-color)`
- **Padding:** `40px`
- **Border Radius:** `24px`
- **Box Shadow:**
  ```css
  inset 0 4px 6px var(--highlight),
  0 8px 20px rgba(0, 0, 0, 0.06)
  ```

## 5. Layout: Keyboard Shortcuts
- **Wrapper (`.shortcut-wrapper`):** `display: flex; align-items: center; justify-content: center; gap: 20px;`
- **Search Text:** `font-size: 32px; font-weight: 600; opacity: 0.8;`
- **Key Group (`.keyboard-keys`):** `display: flex; gap: 12px;`

## 6. Global Interaction Rules
- **Focus (Accessibility):** `outline: 3px solid #a9b2cc; outline-offset: 2px;`
- **Hover:** No default hover state. The tactile clay effect relies entirely on the press animation to simulate physical hardware.
- **Animation:** The snappy click is achieved via the `0.1s ease-out` transition.

## 7. Implementation Notes for Agents
- **Shadow Stacking Order:** The specific order of the `box-shadow` layers is critical. The `inset` highlight MUST be declared first, followed by the hard `bottom-edge` thickness, followed by the soft ambient drop shadow.
- **Active State Logic:** To simulate a mechanical press accurately, the `:active` state must offset the Y-axis (`translateY`) by the exact height of the hard shadow (`5px`), whilst simultaneously reducing the hard shadow's Y-offset to `0px`.
- **Thickness Realism:** The `--bottom-edge` color creates the illusion of physical thickness. It should remain slightly darker and more saturated than the background.