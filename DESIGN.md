# TutorSchool Frontend Design Specification

## Overview

TutorSchool is an ed-tech platform connecting students with tutors across India. The frontend should communicate trust, modernity, and academic excellence while being conversion-focused.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 3
- **Component Library:** shadcn/ui (Card, Button, Badge, Avatar, Dialog, etc.)
- **Icons:** lucide-react
- **Animations:** CSS keyframes + Intersection Observer (no external animation libraries)
- **Fonts:** System font stack (Inter preferred if added)

---

## Brand Identity

### Colors

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--primary` | 158 100% 36% | Primary green - CTAs, accents, highlights |
| `--primary-foreground` | 0 0% 100% | Text on primary backgrounds |
| `--foreground` | 222.2 84% 4.9% | Main text color (near-black) |
| `--muted-foreground` | 215.4 16.3% 46.9% | Secondary text |
| `--background` | 0 0% 100% | Page background (white) |
| `--border` | 340 20% 92% | Subtle borders |
| `--accent` | 25 95% 53% | Orange accent for highlights |

### Typography

- **Headings:** Bold (700), tracking-tight, sizes: 5xl/4xl/3xl/2xl
- **Body:** Regular (400), text-base or text-sm, leading-relaxed
- **Labels:** Semibold (600), uppercase, tracking-wider, text-xs
- **Section overlines:** Primary color, uppercase, letter-spaced

### Spacing

- Section padding: `py-20 lg:py-28`
- Container: `container mx-auto px-4 lg:px-6`
- Card padding: `p-7` or `p-8`
- Grid gaps: `gap-6` or `gap-8`

---

## Design Principles

1. **Clean & Minimal** - Generous whitespace, no visual clutter
2. **Premium Feel** - Subtle gradients, glassmorphism, refined shadows
3. **Trust-Building** - Social proof, stats, testimonials prominently displayed
4. **Conversion-Focused** - Clear CTAs with visual hierarchy
5. **Performance** - CSS-only animations, no heavy JS animation libraries
6. **Responsive** - Mobile-first, works from 320px to 2xl screens

---

## Component Design System

### Cards

```
- Border: border border-border/50
- Background: bg-white/80 backdrop-blur-sm
- Radius: rounded-2xl
- Hover: translateY(-4px) + elevated shadow
- Optional: top accent gradient bar on hover
```

### Buttons

```
Primary:
- rounded-full, font-semibold
- shadow-lg shadow-primary/25
- hover: shadow-primary/40, scale-[1.02]

Outline:
- rounded-full, border-border/50
- hover: bg-primary/5, border-primary/30

With arrow:
- ArrowRight icon, ml-2
- hover: translate-x-0.5 transition
```

### Section Headers

```
<p class="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
  Section Label
</p>
<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
  Section Title
</h2>
<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
  Section description
</p>
```

### Icons in Containers

```
<div class="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
  <Icon class="h-7 w-7 text-primary" />
</div>
```

### Glassmorphism

```
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

---

## Animation System

### Scroll Reveal (Intersection Observer)

Every section uses a `useEffect` with `IntersectionObserver` to add `.revealed` class to elements with `.reveal` class when they enter the viewport.

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal").forEach((el, i) => {
            setTimeout(() => el.classList.add("revealed"), i * 120);
          });
        }
      });
    },
    { threshold: 0.1 }
  );
  if (sectionRef.current) observer.observe(sectionRef.current);
  return () => observer.disconnect();
}, []);
```

### Available Animations

| Class | Effect |
|-------|--------|
| `.reveal` | Fade up (translateY 30px to 0) |
| `.reveal-left` | Slide in from left |
| `.reveal-right` | Slide in from right |
| `.reveal-scale` | Scale from 0.9 to 1 |
| `.animate-float` | Continuous floating motion |
| `.animate-pulse-glow` | Pulsing primary glow |
| `.animate-logo-scroll` | Infinite horizontal scroll |

### Stagger Delays

Add `style={{ transitionDelay: '${index * 120}ms' }}` to stagger child animations.

---

## Page Sections (Top to Bottom)

### 1. Navbar
- Fixed position, glassmorphism on scroll
- Transparent when at top, frosted glass when scrolled
- Logo + nav links + CTA buttons
- Mobile: animated slide-down menu

### 2. Hero
- Gradient mesh background with decorative orbs
- Two-column: text left, image right
- Animated stat counters (Intersection Observer)
- Badge pill: "AI-Powered Tutor Matching"
- Two CTAs: "Find Home Tutor" (primary) + "Find Online Tutor" (outline)
- Partner logos slider with grayscale-to-color on hover

### 3. Trending Now
- Cards with full-bleed background images
- Gradient overlay from bottom for text readability
- Image scale on hover
- Badge + title + subtitle + CTA per card

### 4. Reviews (Parent Testimonials)
- Quote icon design
- Star ratings
- Avatar + name + role
- Subtle background orbs

### 5. Process (How It Works)
- 4-step timeline with connecting gradient line
- Large icon squares with step numbers
- Desktop: horizontal line connecting steps

### 6. Testimonials (Student Stories)
- Score improvement badges (e.g., "65% to 92%")
- Avatar + name + class
- Quote-style testimonial text

### 7. Services (Why Choose Us)
- 2x2 grid
- Icon + title + description per card
- Icon scales on hover

### 8. Holistic Development (Courses)
- Course cards with image, rating pill, metadata
- Image zoom on hover
- Star rating, duration, student count

### 9. For Tutors
- Zero commission headline
- 3 benefit cards with icons
- Animated stats bar (4 stats)
- Single prominent CTA

### 10. Tutoring Opportunities
- Job listing cards with carousel/pagination
- Active hiring badge
- Location, salary, duration metadata
- Login-required card for overflow

### 11. For Employers
- Split layout: image left, content right
- Image zoom on hover
- Highlights grid (2x2)
- Reveal-left / reveal-right animations

### 12. For Schools
- 3 benefit cards (centered, large icons)
- Icon scale on hover
- Single CTA

### 13. AI Features
- Dot-grid background pattern
- 3 feature cards with gradient overlay on hover
- Sparkles badge header
- Bottom CTA in a contained card

### 14. Contact CTA
- Two CTA cards (Teachers / Schools)
- Top accent bar on hover
- Contact info section with icon containers
- Phone, email, location

### 15. Footer
- Dark background (foreground color)
- 5-column layout (brand + 3 link columns)
- Social media icons
- Bottom bar with legal links

---

## Background Patterns

### Gradient Mesh
```css
background:
  radial-gradient(at 40% 20%, hsl(158 100% 36% / 0.08) 0px, transparent 50%),
  radial-gradient(at 80% 0%, hsl(151 75% 69% / 0.06) 0px, transparent 50%),
  radial-gradient(at 0% 50%, hsl(158 100% 36% / 0.04) 0px, transparent 50%);
```

### Dot Grid
```css
background-image: radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px);
background-size: 24px 24px;
opacity: 0.015;
```

### Section Backgrounds
- Never use heavy colored backgrounds
- Use subtle primary tints: `bg-primary/[0.02]` to `bg-primary/[0.05]`
- Decorative blurred orbs: large rounded divs with `blur-3xl`

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| Mobile (<768px) | Single column, stacked layout, hamburger menu |
| Tablet (768px-1024px) | 2-column grids, condensed nav |
| Desktop (>1024px) | Full layout, all columns, expanded nav |

---

## File Structure

```
app/
  page.tsx              - Main page composition
  globals.css           - Animations, utilities, CSS variables
src/
  components/
    Navbar.tsx          - Sticky glassmorphism navigation
    Hero.tsx            - Hero section with counters
    TrendingNow.tsx     - Trending cards
    Reviews.tsx         - Parent testimonials
    Process.tsx         - How it works timeline
    Testimonials.tsx    - Student stories
    Services.tsx        - Why choose us grid
    HolisticDevelopment.tsx - Course cards
    ForTutors.tsx       - Tutor section with animated stats
    TutoringOpportunities.tsx - Job listings carousel
    ForEmployers.tsx    - Split layout for institutions
    ForSchools.tsx      - School benefits
    AIFeatures.tsx      - AI feature cards
    ContactCTA.tsx      - CTA + contact info
    Footer.tsx          - Site footer
  assets/               - Static images (imported directly)
  components/ui/        - shadcn/ui primitives
```

---

## Key Design Decisions

1. **No framer-motion** - All animations are pure CSS + Intersection Observer for zero bundle cost
2. **Glassmorphism sparingly** - Only on navbar and logo bar, not on every card
3. **Consistent card style** - Every card uses the same border/radius/blur pattern
4. **Primary color as accent only** - Never as full backgrounds, always as subtle tints
5. **Rounded-full CTAs** - All buttons are pill-shaped for a modern feel
6. **No emoji in UI** - Professional tone throughout
7. **Whitespace is intentional** - Generous padding creates breathing room
8. **Shadow hierarchy** - Cards use subtle shadows; only CTAs get prominent shadows

---

## Prompt for AI Redesign Tools (Stitch / v0 / Bolt)

Use the following prompt when regenerating the frontend:

---

**PROMPT:**

> Redesign the TutorSchool landing page — an Indian ed-tech platform connecting students with home/online tutors. The tech stack is Next.js 15 (App Router), React 19, Tailwind CSS 3, shadcn/ui, and lucide-react icons.
>
> **Design Direction:**
> - Premium, minimal, Y Combinator-startup aesthetic (think Linear, Vercel, Stripe)
> - Primary color: green (HSL 158 100% 36%) used as subtle accents only
> - White/light backgrounds with soft gradient mesh and decorative blurred orbs
> - Glassmorphism on navbar only (backdrop-blur + transparent bg)
> - All cards: rounded-2xl, border-border/50, bg-white/80 backdrop-blur-sm, hover lifts with shadow
> - All buttons: rounded-full (pill shape), primary buttons have shadow-lg shadow-primary/25
> - Typography: bold tracking-tight headings, relaxed body text, uppercase tracking-wider overlines
> - Scroll-triggered fade-in animations using Intersection Observer (CSS transitions, no framer-motion)
> - Staggered reveals on card grids (120ms delay between items)
> - Animated stat counters on scroll
> - Mobile-first responsive design
>
> **Sections (in order):**
> 1. Sticky glassmorphism navbar with logo, 7 nav links, 2 CTA buttons
> 2. Hero: headline "Find Your Perfect Tutor—Home or Online", animated counters (2000+ tutors, 24hr matching, 10000+ students), two CTAs, partner logo slider
> 3. Trending: image cards with gradient overlays and hover zoom
> 4. Parent Reviews: quote cards with star ratings and avatars
> 5. Process: 4-step horizontal timeline with connecting line
> 6. Student Testimonials: cards with improvement badges
> 7. Services: 2x2 feature grid with icons
> 8. Courses: 4 image cards with ratings and metadata
> 9. For Tutors: zero commission pitch, benefit cards, animated stats bar
> 10. Job Listings: paginated card carousel
> 11. For Employers: split layout (image + content)
> 12. For Schools: 3 benefit cards with large icons
> 13. AI Features: 3 cards with dot-grid background and gradient overlays on hover
> 14. Contact CTA: dual cards + contact info grid
> 15. Footer: dark bg, 5 columns, social icons, legal links
>
> **Constraints:**
> - Use "use client" for components with state/effects
> - Keep section IDs: courses, parents, teachers, schools, ai, tutors
> - Import images from @/assets/ (existing paths)
> - Use shadcn/ui Card, Button, Badge, Avatar components
> - No external animation libraries
> - All CSS custom properties defined in globals.css under :root

---

## Checklist for Design QA

- [ ] Navbar becomes glassmorphism on scroll
- [ ] Hero counters animate when scrolled into view
- [ ] Partner logos scroll infinitely and turn color on hover
- [ ] All sections fade in on scroll
- [ ] Cards lift on hover with smooth shadow transition
- [ ] CTAs have visible hover state (scale + shadow change)
- [ ] Mobile menu animates open/close
- [ ] No horizontal scrollbar on any screen size
- [ ] Section backgrounds flow naturally without hard edges
- [ ] Typography hierarchy is clear (heading > subheading > body > label)
- [ ] Primary green is never overwhelming — used as accents
- [ ] All interactive elements have visible focus states
- [ ] Page loads without layout shift
