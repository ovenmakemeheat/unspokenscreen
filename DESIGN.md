# DESIGN.md — The Unspoken Screen (หน้าจอที่อยากให้ครอบครัวเห็น)

---

## 1. Design Philosophy

The Unspoken Screen bridges an emotional gap between students and their families. The visual language must reflect **warmth, safety, and empathy** — not clinical data presentation. Every design decision should make visitors (especially parents) feel they are being invited into a conversation, not lectured at.

Core principles:
- **Warmth over sterility** — avoid cold whites and stark contrast
- **Empathy through softness** — rounded forms, generous spacing, gentle transitions
- **Trust through clarity** — readable hierarchy, never overwhelming
- **Human before data** — statistics support stories, not the other way around

---

## 2. Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background | Warm Parchment | `#f9f4eb` | Page background, section fills — creates a paper/journal warmth |
| Primary | Calm Blue | `#2f597a` | Headers, nav, primary buttons, links — conveys trust and stability |
| Secondary | Deep Burgundy | `#562634` | Section dividers, supporting headings, blockquotes, decorative accents |
| Accent | Vibrant Orange | `#ff751f` | CTAs, highlights, hover states, data emphasis, attention-grabbing moments |
| Text (body) | Near-black | `#1a1a1a` | Body copy — full readability on warm background |
| Text (muted) | Warm Gray | `#6b6055` | Captions, labels, secondary text |
| Surface | Soft Cream | `#f0e9d8` | Cards, input fields, quote blocks — a step warmer than background |
| Surface Dark | Midnight Blue | `#1e3a4f` | Dark section backgrounds (footer, hero overlays) |

### Color Usage Notes

- **Never** use pure white (`#ffffff`) — the warm off-white background makes white elements feel disconnected.
- The accent orange (`#ff751f`) should be used sparingly to preserve its impact — primarily for CTAs and key statistics.
- Burgundy (`#562634`) pairs with orange for a rich, emotionally grounded contrast without feeling alarming.
- Primary blue (`#2f597a`) on Warm Parchment background passes WCAG AA contrast for body text at 16px+.

---

## 3. Typography

### Font Families

| Role | Font | Fallback |
|---|---|---|
| Thai + Latin Headings | Sarabun | sans-serif |
| Thai + Latin Body | Sarabun | sans-serif |
| Accent / Quotes | Lora | Georgia, serif |

> Sarabun is a Google Font designed for Thai–Latin bilingual readability. Lora adds an editorial, literary warmth to quoted student voices.

### Type Scale

| Level | Size | Weight | Usage |
|---|---|---|---|
| Display | 56–72px | 700 | Hero headline |
| H1 | 40px | 700 | Section titles |
| H2 | 28px | 600 | Sub-section headers |
| H3 | 20px | 600 | Card titles, labels |
| Body Large | 18px | 400 | Lead paragraphs, important copy |
| Body | 16px | 400 | General body text |
| Small | 14px | 400 | Captions, footnotes, metadata |
| Quote | 22px | 400–500 italic | Student voice pull-quotes (Lora) |

### Line Height
- Body: `1.75` — generous leading for both Thai and Latin scripts
- Headings: `1.25`

---

## 4. Spacing System

Base unit: `8px`

| Token | Value | Usage |
|---|---|---|
| xs | 4px | tight gaps |
| sm | 8px | inline spacing |
| md | 16px | component padding |
| lg | 24px | between components |
| xl | 40px | section padding (mobile) |
| 2xl | 64px | section padding (desktop) |
| 3xl | 96px | major section breaks |

Max content width: `1200px`, centered with `auto` horizontal margin.

---

## 5. Component Design

### 5.1 Navigation Bar

- Background: `#2f597a` (Primary)
- Logo / site name: white, Sarabun 600
- Nav links: white, 14–15px, letter-spacing 0.5px
- Active/hover: underline with `#ff751f` (Accent)
- Mobile: hamburger menu with slide-in drawer on `#1e3a4f`

### 5.2 Hero Section

- Background: `#1e3a4f` (Surface Dark) with a subtle grain/noise texture overlay for depth
- Headline: white, Display size, Sarabun 700
- Subheadline: `#f9f4eb` at 80% opacity, Body Large
- CTA Button: `#ff751f` background, white text, bold — "สำรวจเว็บไซต์" / "Explore"
- Secondary CTA: outlined, white border, white text
- Optional: faint abstract wave or gentle particle animation at bottom of hero

### 5.3 Statistics / Data Cards

Used in the "Data & Evidence" section to visualize survey results.

- Card background: `#f0e9d8` (Surface)
- Border: none; subtle `box-shadow: 0 2px 12px rgba(47,89,122,0.08)`
- Stat number: `#ff751f`, 48px, Sarabun 700
- Stat label: `#2f597a`, 14px, uppercase, letter-spacing 1px
- Context text: `#1a1a1a`, 15px

### 5.4 Quote / Voice Blocks (The Anonymous Wall)

Student voices are emotionally central — they deserve prominent treatment.

- Background: `#562634` (Secondary)
- Quote text: `#f9f4eb`, Lora italic, 22px
- Opening quotation mark: `#ff751f`, 80px, decorative
- Attribution: `#f0e9d8`, 13px, muted — e.g., "นักศึกษาชั้นปีที่ 3, ไม่ระบุตัวตน"
- Alternating variant: `#f0e9d8` background with `#562634` text for contrast rhythm

### 5.5 Interactive Question Cards (The Unasked Questions)

- Card background: white-cream `#f0e9d8`
- Question text: `#2f597a`, H3, Sarabun 600
- Hover state: card lifts (`transform: translateY(-4px)`), border-left `4px solid #ff751f`
- Expanded/active: reveals response data visualization within card
- Chart accent colors: Primary `#2f597a`, Secondary `#562634`, Highlight `#ff751f`

### 5.6 Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `#ff751f` | white | — | darken 10% (`#e0641a`) |
| Secondary | `#2f597a` | white | — | darken 10% (`#244868`) |
| Outlined | transparent | `#2f597a` | `#2f597a` | bg fill `#2f597a`, text white |
| Ghost | transparent | `#ff751f` | — | underline |

Border radius: `8px` on standard buttons, `24px` on pill CTAs.

### 5.7 Anonymous Wall Input

- Container background: `#f0e9d8`
- Textarea: white bg, `1px solid #c8bfb0`, border-radius `8px`
- Focus ring: `2px solid #2f597a`
- Submit button: Primary variant (orange)
- Character counter: muted gray `#6b6055`
- Posted messages display as soft cards with left border `#562634`

### 5.8 Section Dividers

Use full-width wave SVG dividers between sections, alternating background colors:
- `#f9f4eb` → `#1e3a4f` → `#f9f4eb` → `#f0e9d8`
- Wave fill matches the destination section color

### 5.9 Footer

- Background: `#1e3a4f` (Surface Dark)
- Text: `#f9f4eb`, 14px
- Links: `#ff751f` on hover
- Tagline: `"เพราะหน้าจอนี้... คือพื้นที่ที่ความในใจได้ส่งถึงกัน"` — centered, Lora italic, `#f0e9d8`

---

## 6. Page Layout — Section Order

```
┌─────────────────────────────────┐
│  NAV BAR                        │  #2f597a
├─────────────────────────────────┤
│  HERO                           │  #1e3a4f
│  Headline + Subtext + CTA       │
├─────────────────────────────────┤
│  THE PROBLEM (Rationale)        │  #f9f4eb
│  Key stats as large numbers     │
│  30% / 4% / 80%                 │
├─────────────────────────────────┤
│  FIELDWORK INSIGHTS             │  #f0e9d8
│  Two insight cards side by side │
├─────────────────────────────────┤
│  STUDENT VOICES (Quote Wall)    │  #562634
│  Rotating/scrolling quotes      │
├─────────────────────────────────┤
│  THE UNASKED QUESTIONS          │  #f9f4eb
│  Interactive question dashboard │
├─────────────────────────────────┤
│  DATA & EVIDENCE                │  #f0e9d8
│  Charts, wordcloud, bar, pie    │
├─────────────────────────────────┤
│  ANONYMOUS WALL                 │  #f9f4eb
│  Submit form + live message feed│
├─────────────────────────────────┤
│  PROPOSED SOLUTIONS             │  #1e3a4f
│  3 cards: Dialogue / Stability  │
│  / Normalizing Failure          │
├─────────────────────────────────┤
│  FOOTER                         │  #1e3a4f
└─────────────────────────────────┘
```

---

## 7. Iconography & Illustration

- Style: **line icons** with a slight warmth — not sharp/tech, not overly cute
- Icon stroke color: `#2f597a` default, `#ff751f` for emphasis
- Illustrations (if used): simple, inclusive characters — no realistic faces
- Avoid medical/clinical imagery (red crosses, clinical whites)
- Preferred metaphors: bridges, open doors, letters, waves, hands

---

## 8. Motion & Animation

- Principle: **gentle and purposeful** — nothing that feels flashy or distracting from the emotional content
- Scroll animations: `fade-up` on section entry, `200ms` delay, `ease-out`
- Stat counters: count-up animation when entering viewport
- Quote cards: slow crossfade or horizontal slide (4–6s auto-advance)
- Hover transitions: `150–200ms ease`
- No looping background animations on heavy sections (respect low-motion preferences)
- Respect `prefers-reduced-motion` media query — disable all motion for users who need it

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, larger touch targets |
| Tablet | 640–1024px | 2-column grids where applicable |
| Desktop | > 1024px | Full layout, max 1200px content width |

- Stack two-column layouts to single column on mobile
- Hero font scales down: Display → 36px on mobile
- Navigation collapses to hamburger at < 768px

---

## 10. Accessibility

- Color contrast: all text/background combos meet WCAG AA (4.5:1 for body, 3:1 for large text)
- Focus indicators: visible `2px solid #ff751f` outline on all interactive elements
- Anonymous wall form: proper `<label>` elements, ARIA roles on live regions
- Charts: include text alternatives / data tables accessible to screen readers
- Thai language: set `lang="th"` on document, switch to `lang="en"` on English spans

---

## 11. Tone Alignment

Every visual element should feel like it was made by someone who **cares**, not a corporation. The palette's warm parchment, the burgundy depth, the orange spark — together they say: *"This is a safe place. We see you."*

The Unspoken Screen is not a data dashboard. It is a letter.
