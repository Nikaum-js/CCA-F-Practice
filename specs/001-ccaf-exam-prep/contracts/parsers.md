# Contract — Source parsers (build-time)

Both sources are a single `README.md`. Fetch raw at build time:
- A: `https://raw.githubusercontent.com/mrKindly/claude-certified-architect/HEAD/README.md`
- B: `https://raw.githubusercontent.com/avidevelops/claude-architect-exam-prep/HEAD/README.md`

Each parser returns `RawQuestion[]` (pre-id, pre-classify):
`{ text, options: {key,text}[], correctKey, explanation, source }`.

## parseRepoA (mrKindly)

Split on question blocks starting at `### Question N of N` (or `### Question N`).
Per block:
- **text**: first non-empty bold line after the heading → strip `**`. (Heading is a counter, NOT the
  question.)
- **options**: lines matching `^- ([A-D]):\s*(.+)` → key, text. Strip any leading `✅ ` and inline
  `✅` from option text.
- **correctKey**: line matching `\*\*\s*✅?\s*Correct Answer:\s*([A-D])` → group 1. Fallback: the
  option whose text contained the inline ✅.
- **explanation**: blockquote after the answer — lines starting `> `; strip `> ` and a leading
  `**Explanation:**` label; join.
- **source**: `'mrKindly'`.

## parseRepoB (avidevelops)

Split on question blocks starting at `### Q\d+:`.
Per block:
- **text**: text after `**Question:**` up to `**Options:**` (trim). (Heading title is a label.)
- **options**: lines matching `^- ([A-D])\)\s*(.+)` → key, text.
- **correctKey**: line matching `\*\*\s*✅?\s*Correct Answer:\s*([A-D])` → group 1 (ignore the
  `— summary` tail).
- **explanation**: concatenate the three sections when present, each prefixed by a short label:
  `Why this is correct: …` + `Why the others are weaker: …` + `Exam Takeaway: …`. Strip `**`, `> `,
  and `💡`.
- **source**: `'avidevelops'`.

## Robustness rules (both)

- Strip emojis (`✅`, `💡`, `🎧`, …) and trailing whitespace from all captured text.
- Tolerate `.`/`)`/`:` option delimiter variants and optional dash bullets.
- A block missing a valid `correctKey` or <4 options is **dropped with a logged warning** (count
  reported at end). Never emit an invalid Question.
- Parsers are pure (string in → objects out) so they are unit-testable without network.

## Post-parse pipeline (build-questions.ts)

1. `parseRepoA(a) ++ parseRepoB(b)` → raw[].
2. `id = sha1(normalize(text)).slice(0,10)`; `normalize` = lowercase, strip punctuation, collapse ws.
3. **dedupe** by normalized text: keep longer `explanation`; set `source: 'merged'` when a dup spanned
   both repos.
4. **classify**: `domain = OVERRIDES[id] ?? classifyDomain(text+options)`; `classifiedBy = OVERRIDES[id]
   ? 'curated' : 'auto'`; `difficulty` heuristic (default `'normal'`; `'hard'` if long/multi-clause —
   best-effort metadata).
5. Sort by domain then id; write `src/data/questions.generated.json` (pretty-printed, committed).
6. Print a summary: counts per source, dups merged, per-domain totals, dropped blocks, auto-vs-curated.
