# Monetra --- Visual Style Guide

> A style-only design specification inferred from the supplied Monetra
> dashboard reference image.\
> **Reference image:** `download (1).jpg` · **Reference dimensions:**
> 736 × 552 px\
> **Scope:** Visual language, color, typography, surfaces, spacing,
> shape, iconography and motion.\
> **Excluded:** Page layout, screen structure, navigation architecture,
> component placement, content hierarchy and user flows.

------------------------------------------------------------------------

## 1. Visual Identity

Monetra uses a clean, modern fintech visual language. Its aesthetic is
minimal, bright, soft and approachable, with a restrained neon-lime
accent that gives the interface a distinctive identity.

### Core style characteristics

-   Light, low-contrast neutral environment.
-   White surfaces against a very pale cool-gray canvas.
-   Dark charcoal typography for clear readability.
-   Bright lime green as the signature accent.
-   Soft shadows rather than heavy borders.
-   Rounded corners and pill-shaped controls.
-   Compact, understated outline iconography.
-   Generous breathing room and a polished, uncluttered finish.

### Design keywords

`Minimal` · `Premium` · `Soft` · `Modern` · `Fintech` · `Bright` ·
`Friendly` · `Precise`

------------------------------------------------------------------------

## 2. Color System

The following values are suggested approximations based on the
screenshot. They are design tokens for implementation, not verified
source-brand values.

### 2.1 Core palette

  Token                Hex         Intended visual use
  -------------------- ----------- ---------------------------
  `canvas`             `#F1F2F5`   Pale cool-gray foundation
  `surface`            `#FFFFFF`   Primary white surface
  `surface-subtle`     `#F8F9F8`   Soft secondary surface
  `surface-muted`      `#F3F4F3`   Muted neutral fill
  `text-primary`       `#17191B`   Main dark text
  `text-secondary`     `#73777D`   Secondary gray text
  `text-muted`         `#A1A5AA`   Low-emphasis labels
  `border-subtle`      `#ECEEF0`   Very subtle outlines
  `accent-lime`        `#A6F52F`   Signature lime accent
  `accent-lime-soft`   `#E9FBD1`   Pale lime tint
  `positive`           `#4DBB70`   Positive status
  `negative`           `#E56C6C`   Negative status
  `info-blue`          `#4D91D8`   Informational accent
  `accent-purple`      `#9161C8`   Secondary category accent
  `accent-orange`      `#E9A84C`   Warm secondary accent

### 2.2 Color character

**Lime green** - Use a vivid yellow-green, not a deep forest green. - It
should feel energetic and fresh. - Keep it selective so it remains
visually distinctive. - Pair it with dark text or icons where contrast
is required.

**Neutrals** - Prefer cool, near-white grays over beige or strongly
tinted backgrounds. - Keep surface-to-surface differences subtle. - Use
charcoal rather than pure black for most text.

**Semantic colors** - Green communicates positive performance or
success. - Red communicates negative performance or errors. - Blue and
purple are secondary informational accents. - Semantic colors should
never be the only way status is communicated.

### 2.3 Suggested color balance

Use the following as a broad visual target:

-   **70--80%** white and near-white neutral surfaces.
-   **15--20%** text, muted gray and subtle neutral details.
-   **3--5%** lime and other semantic accents.

The lime accent should punctuate the visual system rather than dominate
it.

------------------------------------------------------------------------

## 3. Typography

### 3.1 Typeface direction

Use **Inter** as the primary recommended typeface. Its neutral geometric
construction, open counters and strong numeric legibility suit a
contemporary finance interface.

Suggested fallback stack:

``` css
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### 3.2 Type scale

  Token                  Suggested size   Weight Character
  -------------------- ---------------- -------- ---------------------------------
  `type.display`                  28 px      600 Confident, compact display text
  `type.heading-lg`               22 px      600 Strong section-level heading
  `type.heading-md`               18 px      600 Medium heading
  `type.heading-sm`               14 px      600 Compact heading
  `type.body`                     13 px      400 Neutral supporting text
  `type.body-medium`              13 px      500 Emphasized body text
  `type.label`                    11 px      500 Compact labels
  `type.caption`                  10 px      400 Muted metadata
  `type.micro`                     9 px      500 Very small auxiliary text

These values are starting points. Scale them proportionally for
higher-resolution displays and maintain readable minimum sizes.

### 3.3 Typography rules

-   Use sentence case rather than all caps for most labels.
-   Prefer medium or semibold weights for short headings.
-   Use regular weight for descriptions and supporting copy.
-   Keep small labels muted, but never sacrifice legibility.
-   Use tabular numerals for currency, balances, percentages and other
    changing numeric values.
-   Keep line-height comfortable: approximately 1.2--1.3 for headings
    and 1.4--1.6 for body text.
-   Avoid decorative display fonts and excessive font-weight variation.

------------------------------------------------------------------------

## 4. Spacing and Density

The reference has a compact interface, but its visual character depends
on consistent gaps and uncluttered surfaces.

Use a 4 px base spacing scale:

  Token          Value
  ------------ -------
  `space-1`       4 px
  `space-2`       8 px
  `space-3`      12 px
  `space-4`      16 px
  `space-5`      20 px
  `space-6`      24 px
  `space-8`      32 px
  `space-10`     40 px
  `space-12`     48 px

### Spacing principles

-   Use 4--8 px for closely related visual details.
-   Use 8--16 px for compact groupings.
-   Use 16--24 px to separate distinct visual groups.
-   Use 24--40 px for larger areas of breathing room.
-   Keep spacing values consistent; avoid arbitrary one-off gaps.
-   Do not make the interface feel cramped merely to fit more
    information.

------------------------------------------------------------------------

## 5. Shape Language

Rounded geometry is a defining part of the Monetra visual style.

  Token              Value Visual character
  --------------- -------- ----------------------------------
  `radius-xs`         6 px Small, restrained rounding
  `radius-sm`         8 px Compact controls
  `radius-md`        12 px Standard soft corners
  `radius-lg`        16 px Prominent rounded surfaces
  `radius-xl`        20 px Large, soft containers
  `radius-pill`     999 px Fully rounded pills and capsules

### Shape rules

-   Prefer smooth rounded corners over sharp rectangular geometry.
-   Use pill shapes for compact emphasis controls and prominent rounded
    actions.
-   Keep corner radii consistent between visually related elements.
-   Avoid excessive rounding on every small detail; preserve a clear
    radius hierarchy.
-   Circular icon backgrounds and avatar treatments should remain
    geometrically consistent.

------------------------------------------------------------------------

## 6. Surface, Border and Elevation

### 6.1 Surface treatment

-   Primary surfaces should be clean white.
-   Secondary surfaces may use a very light neutral tint.
-   Avoid strong gradients on ordinary white surfaces.
-   Use subtle separation to maintain a light, airy appearance.
-   Avoid thick borders and high-contrast outlines.

### 6.2 Border treatment

Suggested border:

``` css
border: 1px solid #ECEEF0;
```

Borders should be low contrast and used only when needed to clarify an
edge or state.

### 6.3 Shadow system

  --------------------------------------------------------------------------------------
  Token                   Suggested value                        Use
  ----------------------- -------------------------------------- -----------------------
  `shadow-soft`           `0 2px 10px rgba(25, 35, 45, 0.035)`   Subtle surface lift

  `shadow-medium`         `0 6px 20px rgba(25, 35, 45, 0.055)`   Noticeable elevation

  `shadow-floating`       `0 10px 35px rgba(25, 35, 45, 0.08)`   Floating or outer
                                                                 surfaces
  --------------------------------------------------------------------------------------

### Elevation rules

-   Shadows should be diffuse, soft and low-opacity.
-   Avoid dark, hard-edged shadows.
-   Use elevation sparingly; not every white surface needs a shadow.
-   Do not combine a heavy shadow with a strong border.
-   Maintain a consistent shadow character throughout the product.

------------------------------------------------------------------------

## 7. Iconography

### Icon style

-   Use a consistent outline icon family such as Lucide.
-   Prefer simple, recognizable silhouettes.
-   Use rounded line endings where supported.
-   Avoid mixing filled, outlined, 3D and illustrative icon styles.
-   Keep icon geometry visually balanced.

### Icon specifications

  Attribute          Recommendation
  ------------------ ------------------------
  Standard size      18--20 px
  Compact size       14--16 px
  Prominent size     22--24 px
  Stroke width       1.75--2 px
  Default color      Muted charcoal or gray
  Active accent      Lime green
  Secondary accent   Semantic palette

Icons should remain visually secondary to important text and numeric
information.

------------------------------------------------------------------------

## 8. Buttons and Control Styling

This section defines appearance only, not interaction behavior.

### Primary action appearance

-   Bright lime-green fill.
-   Dark charcoal label or icon.
-   Fully rounded pill treatment where appropriate.
-   Medium or semibold typography.
-   No heavy border.
-   Minimal or no shadow.

Suggested starting style:

``` css
.button-primary {
  background: #A6F52F;
  color: #17191B;
  border: 0;
  border-radius: 999px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
}
```

### Secondary action appearance

-   White or very pale neutral fill.
-   Dark or medium-gray label.
-   Subtle border only when necessary.
-   Same height and typography rhythm as related primary actions.

### Icon button appearance

-   Minimal visual chrome.
-   Neutral icon by default.
-   Subtle neutral background for emphasized or selected states.
-   Consistent circular or softly rounded geometry.

### Control states

-   Default: restrained neutral styling.
-   Hover: subtle surface or opacity shift.
-   Focus: clearly visible focus ring.
-   Pressed: slight tonal change.
-   Disabled: muted text and surface without implying an active control.

------------------------------------------------------------------------

## 9. Data Visualization Styling

The reference uses a restrained chart aesthetic.

### Chart visual language

-   Neutral light-gray bars for ordinary data.
-   Lime green for the highlighted data point.
-   Minimal axis lines.
-   Small muted axis labels.
-   Compact period labels.
-   Dark tooltip surface with white text.
-   Rounded bar tops where supported.

### Chart styling rules

-   Avoid heavy grid lines and unnecessary chart decoration.
-   Keep the data series visually distinct.
-   Use consistent bar widths and gaps.
-   Use a dark tooltip to create clear contrast against the pale chart
    surface.
-   Do not use lime for every bar; reserve it for emphasis.
-   Provide non-color distinctions for semantic states.

### Suggested chart colors

  Role                 Color
  -------------------- -----------
  Default data         `#F0F1F0`
  Highlighted data     `#A6F52F`
  Tooltip background   `#17191B`
  Tooltip text         `#FFFFFF`
  Axis labels          `#8A8E93`
  Baseline / grid      `#ECEEF0`

------------------------------------------------------------------------

## 10. Dark Material Styling

The reference includes a dark payment-card visual against the otherwise
light interface.

### Dark surface character

-   Deep charcoal or near-black base.
-   Very subtle tonal gradient.
-   Restrained low-contrast highlights.
-   White primary text.
-   Muted gray secondary text.
-   Small, crisp brand or network marks.

Suggested colors:

  Token                   Hex
  ----------------------- -----------
  `dark-surface`          `#101411`
  `dark-surface-raised`   `#1A211A`
  `dark-text-primary`     `#FFFFFF`
  `dark-text-secondary`   `#B8C0B8`
  `dark-highlight`        `#293629`

Keep dark materials visually premium and understated. Avoid excessive
glow, glossy effects or high-contrast decoration.

------------------------------------------------------------------------

## 11. Motion and Transition Style

Motion should feel quick, subtle and functional.

  Motion token          Suggested duration
  ------------------- --------------------
  `motion-fast`                     120 ms
  `motion-standard`                 180 ms
  `motion-emphasis`                 220 ms

### Motion principles

-   Prefer opacity, color and small elevation transitions.
-   Use gentle easing rather than spring-heavy motion.
-   Avoid large movement or exaggerated bounce.
-   Keep transitions consistent across visually related controls.
-   Respect the user's reduced-motion preference.

Suggested easing:

``` css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
```

------------------------------------------------------------------------

## 12. Accessibility of Visual Styles

Target WCAG 2.2 AA for the implemented interface.

-   Verify text contrast against the actual rendered background.
-   Do not assume lime green is suitable for small text on white; test
    the contrast ratio.
-   Use dark text on lime surfaces where appropriate.
-   Maintain visible focus indicators.
-   Do not communicate status through color alone.
-   Keep small labels readable at normal zoom.
-   Preserve clear distinctions between disabled and active visual
    states.
-   Support reduced motion.
-   Avoid relying on subtle color differences as the only indication of
    selection.

------------------------------------------------------------------------

## 13. Design Tokens --- CSS Reference

``` css
:root {
  /* Colors */
  --color-canvas: #F1F2F5;
  --color-surface: #FFFFFF;
  --color-surface-subtle: #F8F9F8;
  --color-surface-muted: #F3F4F3;

  --color-text-primary: #17191B;
  --color-text-secondary: #73777D;
  --color-text-muted: #A1A5AA;

  --color-border-subtle: #ECEEF0;

  --color-accent: #A6F52F;
  --color-accent-soft: #E9FBD1;

  --color-positive: #4DBB70;
  --color-negative: #E56C6C;
  --color-info: #4D91D8;
  --color-purple: #9161C8;
  --color-orange: #E9A84C;

  /* Typography */
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-size-display: 28px;
  --font-size-heading-lg: 22px;
  --font-size-heading-md: 18px;
  --font-size-heading-sm: 14px;
  --font-size-body: 13px;
  --font-size-label: 11px;
  --font-size-caption: 10px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Radius */
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-soft: 0 2px 10px rgba(25, 35, 45, 0.035);
  --shadow-medium: 0 6px 20px rgba(25, 35, 45, 0.055);
  --shadow-floating: 0 10px 35px rgba(25, 35, 45, 0.08);

  /* Motion */
  --motion-fast: 120ms;
  --motion-standard: 180ms;
  --motion-emphasis: 220ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

------------------------------------------------------------------------

## 14. Style QA Checklist

### Color

-   [ ] Neutral surfaces remain light and low contrast.
-   [ ] Lime green is used as a selective signature accent.
-   [ ] Text colors are legible against their surfaces.
-   [ ] Semantic colors are consistent and not used decoratively.

### Typography

-   [ ] Inter or a visually compatible sans-serif is used consistently.
-   [ ] Heading and body weights are clearly differentiated.
-   [ ] Numeric values use tabular figures.
-   [ ] Small labels remain readable.

### Shape and surfaces

-   [ ] Corner radii follow a consistent scale.
-   [ ] Shadows are soft and diffuse.
-   [ ] Borders are subtle.
-   [ ] White surfaces do not become visually heavy.

### Iconography and controls

-   [ ] Icon family and stroke weight are consistent.
-   [ ] Primary controls use the lime accent consistently.
-   [ ] Secondary controls remain visually quiet.
-   [ ] Focus states are visible.

### Motion and accessibility

-   [ ] Transitions are short and restrained.
-   [ ] Reduced-motion preferences are respected.
-   [ ] Contrast is verified against WCAG 2.2 AA.
-   [ ] Status is not communicated by color alone.

------------------------------------------------------------------------

## 15. Style Interpretation Notes

This guide documents the **visual style only**. It intentionally does
not define page layout, screen composition, navigation, component
arrangement, information architecture, data behavior or product
workflows.

All color values, font sizes, radii, shadows and spacing values are
inferred approximations from the supplied raster reference. Treat them
as a coherent starting design system and validate them against original
brand assets or approved design files before production use.
