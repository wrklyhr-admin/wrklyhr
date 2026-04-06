# WrklyHR — Recruiting Agency Landing Page

A full-page marketing site for a specialist recruiting agency, built with Next.js 14 (App Router) and Tailwind CSS.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion (scroll fade-in + count-up)
- **Icons**: Lucide React
- **Marquee**: react-fast-marquee
- **Fonts**: Syne (headings) + Inter (body) via next/font
- **Port**: 5000

## Color Palette

| Token       | Value     | Usage              |
|-------------|-----------|-------------------|
| primary     | #2D2B8F   | Deep Indigo        |
| accent      | #7C3AED   | Electric Violet    |
| highlight   | #84CC16   | Lime Green         |
| bgLight     | #F8F8FB   | Light background   |
| bgDark      | #0F0F1A   | Dark background    |

## Sections

1. **Navbar** — Sticky with logo, nav links, CTA button, mobile drawer
2. **Hero** — Split layout, bold headline, CTAs, trust badges, stats bar, dot grid
3. **Marquee** — Infinite scrolling job functions strip
4. **Services** — 3 cards: Permanent Hiring, Contract Staffing, Executive Search
5. **How It Works** — 4-step horizontal stepper with dashed connector
6. **Industries** — 8-tile icon grid with hover glow
7. **Stats** — Animated count-up numbers on scroll (Framer Motion)
8. **Testimonials** — 3 quote cards with star ratings
9. **CTA Banner** — Gradient background with consultation button
10. **Footer** — Logo, links, email, social icons

## Development

```
npm run dev    # Starts on port 5000
npm run build  # Production build
```

## Project Structure

```
app/
  layout.tsx      - Root layout, fonts, metadata
  page.tsx        - Assembles all section components
  globals.css     - Tailwind base, custom utilities
components/
  Navbar.tsx
  Hero.tsx
  MarqueeStrip.tsx
  Services.tsx
  HowItWorks.tsx
  Industries.tsx
  Stats.tsx
  Testimonials.tsx
  CTABanner.tsx
  Footer.tsx
next.config.mjs   - Next.js config
tailwind.config.ts
postcss.config.mjs
```
