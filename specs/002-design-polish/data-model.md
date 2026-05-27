# Phase 1 Data Model: Bold Visual Redesign

> **No application data entities** are added, removed, or changed by this feature — it is purely
> presentational (spec "Key Entities": none). The "model" here is the **design-token model**: the
> tokenized vocabulary the redesign introduces in `src/index.css` and consumes across the UI. This
> exists so token additions stay curated and coherent (Principle V), not scattered.

## Token Groups

### 1. Color — base surfaces (existing, may be re-tuned)

| Token | Role | Constraint |
|-------|------|------------|
| `--background` / `--foreground` | page base + body text | foreground vs background ≥ WCAG AA |
| `--card` / `--card-foreground` | raised surfaces | AA against card |
| `--muted` / `--muted-foreground` | secondary text/surfaces | muted-foreground ≥ AA where it carries info |
| `--primary` / `--accent` (orange) | brand accent | AA when used behind text |
| `--destructive`, `--success` | wrong / correct semantics | AA against their surface |

### 2. Color — per-domain vivid family (formalized/intensified)

| Token | Domain | Notes |
|-------|--------|-------|
| `--domain-d1` | D1 Agentic | vivid, consistent across badge/card/bar |
| `--domain-d2` | D2 Tools/MCP | " |
| `--domain-d3` | D3 Claude Code | " |
| `--domain-d4` | D4 Prompting | " |
| `--domain-d5` | D5 Context | " |

**Rule**: each domain color is used the same way everywhere (badge fill, card accent, progress bar)
and every text overlaid on it meets AA. A matching `*-foreground` is defined where text sits on the color.

### 3. Typography — weight scale

| Token | Weight | Allowed use |
|-------|--------|-------------|
| body/long-form | 400 / 500 | paragraphs, options, descriptions (heavier FORBIDDEN here) |
| heading | 600 | section headings, card titles |
| display / score | 700 | score number, big display, pass/fail outcome |

### 4. Elevation — tokenized scale

| Token | Role | Constraint |
|-------|------|------------|
| `--elevation-surface` | flat card resting | soft, OKLCH-tinted; no inline shadow allowed |
| `--elevation-raised` | hover/selected lift | subtle; must not reduce contrast below AA |
| `--elevation-overlay` | dialogs/popovers | strongest, still restrained |

### 5. Interaction states (per interactive element)

State machine for the quiz **option button** (the richest case):

```
idle ──hover──▶ hover ──click──▶ selected ──reveal──▶ correct | wrong
  │                                                      ▲
  └────────────── focus-visible (orthogonal, keyboard) ──┘
disabled (post-answer, non-selected options)
```

| State | Distinct cue (tokenized) |
|-------|--------------------------|
| idle | base card surface + border |
| hover | raised elevation / border accent |
| focus-visible | visible focus ring (keyboard) — MUST be present (FR-006) |
| selected | accent border/fill before reveal |
| correct | `--success` treatment |
| wrong | `--destructive` treatment |
| disabled | muted, reduced emphasis, still legible |

## Invariants

- Every value above is a **token** in the `@theme`/CSS layer — no component hardcodes a color,
  weight, or shadow (Principle V, FR-008).
- All text/UI meets **WCAG AA** in the dark theme (FR-005, SC-003).
- No token change alters behavior, i18n, or persisted `ccaf_*` state.
