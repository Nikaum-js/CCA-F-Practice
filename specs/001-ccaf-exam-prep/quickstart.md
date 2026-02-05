# Quickstart — CCA-F Exam Prep App

## Prerequisites
- Bun installed (`bun --version`).

## Install & run
```bash
bun install
bun run build:questions   # fetch sources → src/data/questions.generated.json (network needed ONCE)
bun run dev               # Vite dev server (via Bun)
```
Open the printed localhost URL. After `build:questions` has produced the JSON, the app runs fully
offline.

## Scripts (package.json)
- `dev` → `vite`
- `build` → `tsc -b && vite build`
- `build:questions` → `bun run scripts/build-questions.ts`
- `preview` → `vite preview`
- `lint` → `eslint .`

## Verify (acceptance smoke)
1. `bun run build:questions` prints per-domain counts that sum to the bank size; writes the JSON.
2. `tsc --noEmit` passes (no type errors).
3. `bun run dev`: Home shows 5 domain cards, exam sizes, mixed mode, and history table; the
   "unofficial weights" disclaimer is visible.
4. Start a domain session → answer → immediate mode reveals explanation → results show `X/N (%)`.
5. Start a 60-question exam → finish → see a 100–1000 score, pass/fail badge, and a new history entry;
   Home StatsBar updates best/last/count.
6. Toggle PT↔EN: all chrome switches; question text stays English.
7. Enable the timer in the mode picker (default OFF) → countdown turns amber then red; on expiry the
   question is skipped and the session advances.
8. Start a session, answer 2, refresh → resume banner → resume to same question.
9. Offline test: stop network, reload → app still works (generated JSON is bundled).

## Notes
- If `build:questions` fails (offline/rate-limit), the app still loads the 10-question seed.
- Domain classification: review `src/data/questions.generated.json`; add curation entries to the
  `DOMAIN_OVERRIDES` map in `scripts/build-questions.ts` and re-run to lock `classifiedBy: 'curated'`.
