# GlamHub Design System Tokens

## Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-navy` | #0B2545 | Trust, primary backgrounds, headers |
| `--color-emerald` | #047857 | Growth, primary actions, buttons |
| `--color-gold` | #F2B134 | Premium accents only |
| `--color-soft-white` | #FFFFFF | Backgrounds |
| `--color-text-primary` | #0B2545 | Body text on white |
| `--color-text-secondary` | #4B5563 | Secondary text |
| `--color-text-inverse` | #FFFFFF | Text on navy/emerald |
| `--color-border` | #E5E7EB | Borders, dividers |
| `--color-error` | #DC2626 | Error states |
| `--color-success` | #047857 | Success states |
| `--color-warning` | #F2B134 | Warning states |

## Typography
| Token | Value | Usage |
|-------|-------|-------|
| `--font-heading` | 'Plus Jakarta Sans', sans-serif | Headings |
| `--font-body` | 'Inter', sans-serif | Body text |
| `--text-xs` | 0.75rem | Small text |
| `--text-sm` | 0.875rem | Small body |
| `--text-base` | 1rem | Default body |
| `--text-lg` | 1.125rem | Large body |
| `--text-xl` | 1.25rem | Section headings |
| `--text-2xl` | 1.5rem | Page headings |
| `--text-3xl` | 1.875rem | Hero headings |

## Spacing
| Token | Value |
|-------|-------|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.25rem (20px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |

## Border Radius
| Token | Value |
|-------|-------|
| `--radius-sm` | 0.25rem (4px) |
| `--radius-md` | 0.375rem (6px) |
| `--radius-lg` | 0.5rem (8px) |
| `--radius-full` | 9999px |

## Touch Targets
- Minimum touch target: 44px x 44px
- Minimum text contrast: 4.5:1

## Component Specs
- **Button**: Emerald fill, white text, 44px min height, rounded-md, hover state darker emerald
- **Card**: White background, navy border, rounded-lg, padding-6
- **Input**: White background, navy border, 44px min height, focus ring emerald
- **Badge**: Gold or emerald background, white/navy text, rounded-full, text-xs
- **Modal**: Navy overlay, white content card, rounded-lg, escape to close
- **Table**: Striped rows, navy header, paginated, searchable