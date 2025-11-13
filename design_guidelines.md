# Design Guidelines: Old Chinese Translation Web Application

## Design Approach
**System-Based Design** using Material Design principles - optimal for this utility-focused translation tool requiring clear information hierarchy and excellent typography for multiple language scripts.

## Core Design Principles
- **Clarity First**: Clean, uncluttered interface prioritizing readability of Korean and Chinese characters
- **Functional Beauty**: Minimalist aesthetic that highlights content over decoration
- **Instant Feedback**: Clear visual states for all interactions (translating, playing audio, etc.)

## Typography System

**Primary Font**: Noto Sans CJK (via Google Fonts) - optimal for Korean, Chinese characters, and romanization
**Secondary Font**: Inter for UI labels and buttons

Hierarchy:
- Page Title: text-3xl font-bold
- Section Headers: text-xl font-semibold
- Input/Output Text: text-lg leading-relaxed (optimal for character readability)
- Romanization: text-sm font-mono (monospace for phonetic clarity)
- UI Labels: text-sm font-medium
- Metadata/Timestamps: text-xs

## Layout System

**Spacing Units**: Use Tailwind units of 2, 4, 6, and 8 for consistent rhythm (p-4, gap-6, m-8, etc.)

**Container Strategy**:
- Main content: max-w-4xl mx-auto
- Translation panels: Full width within container
- History sidebar: w-80 fixed on desktop, slide-over on mobile

**Grid Structure**: Single-column focus on mobile, two-column layout on desktop (input left, output right with 1:1 ratio)

## Component Library

### Translation Interface
**Input Panel**:
- Large textarea (min-h-48) with rounded-lg border
- Character counter bottom-right
- Clear button (x icon) when text present
- Translate button: Primary, full-width on mobile, w-auto on desktop

**Output Panel**:
- Chinese characters display: Large, prominent (text-2xl)
- Romanization below: Gray text, monospace
- Audio playback button: Circular, positioned top-right of output panel with speaker icon
- Copy button: Secondary, positioned beside audio button

### History Sidebar
- Scrollable list of previous translations
- Each item shows: Korean snippet (truncated), Chinese result, timestamp
- Click to restore translation
- Clear history button at bottom

### Navigation
Simple header: Logo/title left, minimal navigation right (About, Help links)

### Audio Player
- Circular play button with waveform icon
- Loading spinner during audio generation
- Success/error states with icon changes

## Interaction Patterns

**Translation Flow**:
1. User types Korean → auto-enable translate button
2. Click translate → button shows loading spinner
3. Result animates in with subtle fade
4. Audio button appears with gentle scale animation

**States**:
- Empty state: Helpful placeholder text with example
- Loading: Skeleton screens for output panel
- Error: Inline error message with retry option
- Success: Smooth content reveal

## Page Layout

### Desktop (lg+)
```
[Header: Full width, h-16]
[Main Container: max-w-6xl, py-8]
  [Two-column grid: gap-6]
    - Input Panel (Left)
    - Output Panel (Right)
  [History Section: Below, mt-8]
```

### Mobile
```
[Header]
[Stacked Layout: p-4]
  - Input Panel
  - Translate Button (full-width, mt-4)
  - Output Panel (mt-6)
  - History (mt-8, collapsible)
```

## Visual Enhancements
- Subtle shadow on panels (shadow-sm)
- Border treatments: border rounded-lg
- Hover states: Slight scale (hover:scale-105) on interactive elements
- Focus rings: Prominent for accessibility (ring-2 ring-offset-2)

## Accessibility
- High contrast for all text (Korean, Chinese, romanization)
- Clear focus indicators throughout
- ARIA labels for audio controls
- Keyboard shortcuts: Enter to translate, Space to play audio

## No Hero Image
This is a tool-focused application - launch directly into the translation interface without marketing elements.