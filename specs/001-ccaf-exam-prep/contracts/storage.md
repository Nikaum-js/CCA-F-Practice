# Contract — localStorage schema

All access goes through `src/lib/storage.ts` (typed get/set with JSON parse + try/catch + defaults).

| Key | Type | Default when absent | Written by |
|---|---|---|---|
| `ccaf_questions` | `Question[]` | `[]` (then app loads generated JSON / seed) | `questions.ts` cache |
| `ccaf_lang` | `'pt' \| 'en'` | `'pt'` | `useLang` |
| `ccaf_domain_stats` | `DomainStats` | all domains `{attempted:0,correct:0,lastPracticed:null}` | `useStats` |
| `ccaf_exam_history` | `ExamResult[]` | `[]` | `useStats` (60q only) |
| `ccaf_session` | `ActiveSession \| null` | `null` | `useQuiz` |

Rules:
- Every read tolerates malformed/legacy JSON → returns the default (never throws to the UI).
- `ccaf_session` is written on every answer and every timer tick (≤1/s) for crash-safe resume.
- Writing `ccaf_session = null` on results/exit-to-results clears the resume banner.
- Stats update after every session (all modes); exam history appends only for `exam` size 60.
- `loadQuestionBank()`: prefer in-memory import of `questions.generated.json`; if empty/missing, use
  `seed`. The bank may also be cached into `ccaf_questions`, but the generated import is the source of
  truth (offline-first, no runtime fetch).
