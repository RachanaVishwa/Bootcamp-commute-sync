---
name: Antigravity Commute Engine
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  headline-xl:
    fontFamily: Comic Relief
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Comic Relief
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Comic Relief
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Comic Relief
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Comic Relief
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Comic Neue
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Comic Neue
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Comic Neue
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  mono-label-lg:
    fontFamily: Comic Neue
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  mono-label-md:
    fontFamily: Comic Neue
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  mono-label-sm:
    fontFamily: Comic Neue
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  badge-timing:
    fontFamily: Comic Neue
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system establishes a playful, casual developer-first companion aesthetic tailored for technical builders attending intensive AI bootcamps. Drawing direct inspiration from playful developer utilities and comic-inspired tech culture, the visual tone is lighthearted yet precise, bridging structured machine interfaces with whimsical community coordination.

### Design Movement: Playful Developer Console + Subtle Glassmorphism
The aesthetic fuses deep slate surfaces with controlled luminous accents, playful comic typography, and contextual glass diffusion. Structural elements leverage high-density monospaced labeling, explicit micro-status badges, and deliberate spatial discipline. Interactive targets convey tactile clarity through high-contrast gradients and distinct geometric outlines.

### Target Audience & Emotional Impact
- **Audience:** Machine learning engineers, software developers, and technical founders operating in fast-moving urban tech corridors who appreciate a touch of whimsy.
- **Atmosphere:** Efficient, peer-driven, approachable, and playfully energizing.
- **Cognitive Clarity:** Immediate binary clarity on RSVP choices, frictionless locality and schedule selection, zero ambiguous interaction states, and privacy-first visual signaling.

## Colors

The palette is rooted in an ultra-deep charcoal navy space (`#0B0F19`), ensuring extended visual comfort for developers working in terminal-like environments while maximizing contrast for critical status indicators.

### Key Roles
- **Primary (`#3B82F6` - Electric Blue):** Drives primary directional actions, active tab selectors, key metadata tags, and navigational confirmations.
- **Secondary (`#10B981` - Emerald Green):** Powers affirmative community states, positive RSVP responses (`YES, Count me in!`), matched headcount highlights, and completed coordination milestones.
- **Tertiary (`#F59E0B` - Radiant Amber):** Reserved specifically for temporal urgency, live boarding windows, T-minus alert schedules, and critical departure buffers.
- **Neutral (`#0B0F19` - Deep Slate Void):** Forms the foundational viewport substrate, stepped upward into structured containers via `#0F172A` and `#1E293B`.

### Color Interaction Rules
- Never use pure black (`#000000`) for card surfaces; use `#0F172A` for primary containers and `#1E293B` for nested/interactive sub-cards.
- Border definitions must maintain a minimum 1.5:1 edge ratio against their parent container using `#1E293B` or `#334155`.
- Text contrast must adhere strictly to WCAG AA: `#F8FAFC` for headline and primary content, `#94A3B8` for supportive specifications, and `#64748B` strictly for inactive states or field helper text.

## Typography

The typographic hierarchy pairs the friendly, expressive clarity of **Comic Relief** for headlines with the approachable handwriting of **Comic Neue** for body copy and technical labels, giving the technical dashboard a uniquely fun and informal character.

### Hierarchy & Application
- **Comic Relief (Headlines):** Deployed for high-legibility interface copy, prompts, greetings, instructions, and standard field inputs with a friendly comic flair.
- **Comic Neue (Body & Labels):** Exclusively leveraged for transit hub names, precise timestamps, headcount chips, API version pills, and token identifiers.

### Readability Guardrails
All labels must be displayed in either medium (`500`) or semibold (`600`) weights to maintain clarity against dark slate backgrounds. Dynamic calculations like countdown clocks and route timestamps must consistently feature tabular numerals to prevent layout shifting.

## Layout & Spacing

The layout philosophy centers on a condensed, focus-driven single-column flow on mobile viewports (`max-width: 480px`) that smoothly translates into an organized multi-tier dashboard on desktop screens (`max-width: 960px`). 

### Adaptive Grid & Breakpoints
- **Mobile (<640px):** Single vertical stack with `1rem` (16px) margins. Elements expand to full width within container safe zones. Tap targets are vertically stacked or set in equal two-column button pairs.
- **Tablet (640px - 1024px):** Single centered container capped at `600px` with `1.5rem` lateral margin to maintain strict thumb readability.
- **Desktop (>1024px):** Centered split layout (max `960px` container) with a 12-column fluid grid. Left column (7 cols) carries configuration and live community matching; right column (5 cols) hosts the Event-Day Huddle Manifest and quick venue itinerary.

### Spacing Rhythm
Standard spacing relies strictly on a 4px/8px modular rhythm. Outer component paddings use `space-lg` (24px) on desktop and `space-md` (16px) on mobile. Micro-gaps between label tags and icon indicators use `space-xs` (8px).

## Elevation & Depth

Visual hierarchy does not rely on diffused drop shadows that cloud dark mode interfaces. Instead, spatial layering is orchestrated through **tonal stratification, refined 1px edge definitions, and translucent backdrop blurring**.

### Surface Hierarchy
1. **Canvas Layer (`#0B0F19`):** Base workspace background. Zero elevation.
2. **Base Card Surface (`#0F172A` with 80% opacity + `backdrop-filter: blur(12px)`):** Primary cards hosting prompts, attendee input forms, and city switchers. Outlined with `1px solid #1E293B`.
3. **Elevated Card / Sub-Container (`#1E293B`):** Nested information blocks such as origin hub selectors, landmark meeting callouts, and schedule badges. Outlined with `1px solid #334155`.
4. **Active State / Hover Illumination:** On hover or active focus, cards project a concentrated 0px blur 1px ring border (`#3B82F6` or `#10B981`) combined with a faint underlying radial luminescence (`rgba(59, 130, 246, 0.08)`).
5. **Floating Overlay / Sheets:** Backdrop fill `rgba(11, 15, 25, 0.75)` with `blur(16px)` and subtle border highlights at the top edge (`rgba(255, 255, 255, 0.08)`).

## Shapes

The design system implements a controlled hybrid shape language: **modern rounded structural containers** paired with **hyper-tactile pill geometry** for status badges, tags, and atomic controls.

### Shape Assignment
- **Cards & Data Modules:** `8px` (`rounded-md`) to `12px` (`rounded-lg`). Retains an architectural contour.
- **Form Inputs & Selection Panels:** `8px` (`rounded-md`).
- **Interactive Badges, Tabs & Buttons:** Full pill geometry (`rounded-full` / 9999px) for boarding chips, live counts, RSVP action buttons, and session selectors. This creates an immediate cognitive distinction between informational architecture and interactive touchpoints.

## Components

### 1. RSVP Binary Decision Cards
- **Container:** High-contrast bordered card (`#0F172A`, 1px border `#334155`). Contains the hero question in `headline-lg`.
- **"YES, Count Me In" Button:** Full pill shape. Background utilizes a high-energy gradient from emerald green (`#10B981`) to electric blue (`#3B82F6`). Label in bold white text, accompanied by a group icon. On hover: subtle scale `1.01` and luminous outer halo.
- **"NO, I'm Good" Button:** Full pill shape. Ghost/outline styling (`1px solid #334155`), background transparent. Text color `#94A3B8`. On hover: border transitions to `#64748B`, text shifts to `#F8FAFC`.

### 2. State Feedback Views
- **"NO" Polite Acknowledgment:** Low-prominence container featuring a subtle compass icon in `#64748B`, muted message in `body-md`, and an inline text link button: *"Changed your mind? Edit your preference"* with an electric blue underline.
- **"YES" Affirmation Banner:** Vibrant, semi-transparent teal header strip (`rgba(16, 185, 129, 0.1)`) with `1px solid rgba(16, 185, 129, 0.25)` edge and glowing emerald checkmark icon.

### 3. Boarding Time & Hub Chips
- **Time Selection Chips:** Horizontally scrollable row of pill-shaped chips displaying arrival windows (`07:30 AM`, `07:45 AM`, `08:00 AM`). 
- **Typography:** `Comic Neue` at `13px`.
- **States:** Inactive chips feature dark slate fills (`#1E293B`) with `#94A3B8` text. Selected chip flips to `#3B82F6` solid fill or `#10B981` with crisp white monospaced text.

### 4. Input Fields & Dropdowns
- **Field Background:** Solid `#0F172A` with an inner border of `#1E293B`.
- **Height:** 44px for optimal mobile touch fidelity.
- **Focus State:** 1px ring in `#3B82F6`, background elevation shifts to `#1E293B`.
- **Placeholder Text:** Clean sans-serif in `#64748B`.

### 5. Live Community Headcount Pill
- **Structure:** Pill badge containing a live pulsating dot indicator.
- **Styling:** Background `rgba(16, 185, 129, 0.12)`, border `1px solid rgba(16, 185, 129, 0.3)`.
- **Content:** Icon + `mono-label-md` reading `🔥 7 BUILDERS BOARDING FROM THIS HUB`.

### 6. Event-Day "Huddle Manifest" Card
- **Structure:** Two-tiered technical module.
- **Header:** Labeled `EVENT-DAY HUDDLE MANIFEST` with an amber timing badge (`T-60 MIN`).
- **Origin Meetup Landmark:** Elevated `#1E293B` sub-card with a copyable text module: *"Gate B Ticket Counter, Indiranagar Metro @ 7:45 AM"*.
- **Group Roster:** Compact overlapping circular initials badges with electric blue borders.
- **Last-Mile Cab Split Action:** Callout block with dashed border (`#334155`) suggesting immediate multi-builder ride split to the venue gates with estimated per-person fare calculation.

### 7. Developer Tooling Footer Badge
- **Style:** Compact pill fixed at page bottom or footer.
- **Content:** Interactive pill tag reading `FastAPI v1 • Swagger Docs [/docs]` with an external link arrow, reinforcing the technical DNA with a playful twist.