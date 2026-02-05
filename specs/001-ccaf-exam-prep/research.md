# Phase 0 — Research

## R1. Build tooling: Bun + Vite + Tailwind v4 + shadcn

- **Decision**: Bun = runtime/package manager; **Vite** = bundler (`@tailwindcss/vite`); shadcn via
  `bunx --bun shadcn@latest`; React 19; Tailwind v4 CSS-first.
- **Rationale**: shadcn CLI v4 has no Bun-bundler scaffold target; Vite is the documented happy-path
  for Tailwind v4 + shadcn, and Bun runs Vite fine. React 19 needs no peer-dep flags under Bun.
- **Alternatives**: Pure `Bun.serve` fullstack bundler — viable for SPA but "work in progress"
  (no `bun build` fullstack, no SSR), requires manual shadcn wiring. Rejected for friction.

## R2. Tailwind v4 tokens (replaces spec §11 v3 approach)

- **Decision**: Define tokens in `src/index.css` via `@import "tailwindcss"`, `@custom-variant dark`,
  `:root`/`.dark` with **OKLCH** color values, and an `@theme inline` block mapping CSS vars to
  Tailwind tokens. Add `--success` and `--destructive` tokens; no `tailwind.config.js`.
- **Rationale**: This is exactly what shadcn v4 emits; the spec's HSL-triplet + `extend` config is the
  legacy v3 path Tailwind v4 ignores.
- **Alternatives**: Keep HSL via `@config` bridge — rejected (diverges from generated components).

## R3. Source question formats (drives the two parsers)

- **Decision**: Two bespoke parsers; both sources are a single `README.md` (no JSON, no per-question
  files, no structured domain field).
- **Repo A — `mrKindly/claude-certified-architect`** (~60 q): `### Question N of N` counter headings;
  question text on a **bold** line below; options `- A:` (dash + colon); answer `**✅ Correct Answer:
  X**`; explanation in a blockquote `> **Explanation:** ...`; the chosen option also carries an inline
  ✅ to strip. Grouped under 4 scenario H2 sections.
- **Repo B — `avidevelops/claude-architect-exam-prep`** (~33 q): `### Qn: Title` headings; italic
  blockquote `> *Scenario: ...*`; body under `**Question:**`; options under `**Options:**` as
  `- A) ...`; answer `**✅ Correct Answer: X — summary**`; explanation = three bold sections
  (`**Why this is correct:**`, `**Why the others are weaker:**`, `**💡 Exam Takeaway:**`) concatenated.
- **Rationale**: Confirmed via live fetch during investigation. Parsers MUST be defensive (strip
  emojis, blockquote markers, inline answer markers) and re-verify against the raw README at build time.
- **Alternatives**: Single tolerant regex — rejected; matches nothing (formats differ from each other).

## R4. Certification provenance

- **Decision**: Treat the certification as real (Anthropic Partner Network announcement, 2026-03-12)
  but label all domains/weights/scale/cutoff as **community-sourced, unofficial**.
- **Rationale**: Anthropic has not published an exam blueprint; presenting weights as official would
  be inaccurate. (Constitution Principle VI.)

## R5. Domain classification

- **Decision**: Keyword scorer (spec keyword table) produces an `auto` assignment; a curation override
  map produces `curated` assignments that win. The generated JSON is the reviewable artifact.
- **Rationale**: The bank is small and fixed; curation gives the accuracy the app's core value
  ("find weak domains") needs, while the keyword pass bootstraps it.
- **Alternatives**: Pure runtime keyword heuristic — rejected (noisy, undermines weak-domain signal).

## R6. SHA-1 id generation

- **Decision**: Compute stable ids at **build time** in the Bun script (Node `crypto`), not in the
  browser. `id = sha1(normalizedText).slice(0,10)`.
- **Rationale**: Avoids async `crypto.subtle` in the app and keeps ids stable/committed.
