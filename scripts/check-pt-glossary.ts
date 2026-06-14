/*
  PT glossary guardrail. Run with: bun run scripts/check-pt-glossary.ts

  Cross-checks the additive PT translation layer (src/data/questions.pt.json) against the canonical
  English bank (src/data/questions.generated.json) to keep technical terms verbatim in Portuguese.
  English is the source of truth (Princípio III) — the PT layer must NOT translate code identifiers
  or established technical vocabulary.

  Two severities:
    • HARD (exit 1): a Tier-A identifier present in the EN field is missing from the same PT field
      (e.g. `isError`, `tool_choice`, `JSON`). These are non-negotiable verbatim tokens.
    • SOFT (warn, exit 0): a Tier-B technical term appears in the EN field but the PT field uses a
      known Portuguese rendering of it (e.g. EN "chunk" → PT "pedaços"). Printed for human review —
      soft because some words ("disparar", "recuperação") have legitimate natural-language uses.
*/
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Question } from '../src/data/schema.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EN_PATH = resolve(__dirname, '../src/data/questions.generated.json')
const PT_PATH = resolve(__dirname, '../src/data/questions.pt.json')

type PtEntry = { text?: string; options?: Record<string, string>; explanation?: string }

// Tier A — identifiers / proper nouns that MUST appear verbatim in PT whenever they are in the EN.
const HARD_TERMS: RegExp[] = [
  /\bisError\b/,
  /\btool_choice\b/,
  /\btool_use\b/,
  /\btool_result\b/,
  /\buser_id\b/,
  /\bmax_tokens\b/,
  /\bend_turn\b/,
  /\bstop_reason\b/,
  /\bcache_control\b/,
  /\bsystem_prompt\b/,
  /\bJSON\b/,
]

// Tier B — technical terms to keep verbatim; flag known PT renderings for review.
const SOFT_TERMS: { en: RegExp; forbiddenPt: RegExp[]; label: string }[] = [
  { label: 'chunk', en: /\bchunks?\b/i, forbiddenPt: [/\bpeda[çc]os?\b/i] },
  { label: 'trigger', en: /\btriggers?\b/i, forbiddenPt: [/\bgatilhos?\b/i] },
  { label: 'embedding', en: /\bembeddings?\b/i, forbiddenPt: [/\bincorpora[çc][õo]es?\b/i, /\bincrusta\w*/i] },
  { label: 'endpoint', en: /\bendpoints?\b/i, forbiddenPt: [/ponto de extremidade/i, /ponto final/i] },
  { label: 'streaming', en: /\bstreaming\b/i, forbiddenPt: [/transmiss[ãa]o em fluxo/i, /fluxo cont[íi]nuo/i] },
  { label: 'throughput', en: /\bthroughput\b/i, forbiddenPt: [/taxa de transfer\w*/i, /vaz[ãa]o/i] },
  { label: 'rollback', en: /\brollback\b/i, forbiddenPt: [/revers[ãa]o/i] },
]

const FIELDS = ['text', 'explanation'] as const

function snippet(s: string, re: RegExp): string {
  const m = s.match(re)
  if (!m || m.index === undefined) return ''
  const start = Math.max(0, m.index - 35)
  return '…' + s.slice(start, m.index + m[0].length + 35).replace(/\s+/g, ' ') + '…'
}

function main() {
  const enBank: Question[] = JSON.parse(readFileSync(EN_PATH, 'utf8'))
  const pt: Record<string, PtEntry> = JSON.parse(readFileSync(PT_PATH, 'utf8'))
  const enById = new Map(enBank.map((q) => [q.id, q]))

  const hardHits: string[] = []
  const softHits: string[] = []

  for (const [id, entry] of Object.entries(pt)) {
    const en = enById.get(id)
    if (!en) continue

    // Pair up comparable EN/PT strings per field (text, explanation, each option).
    const pairs: { field: string; enText: string; ptText: string }[] = []
    for (const f of FIELDS) {
      const ptText = entry[f]
      if (ptText) pairs.push({ field: f, enText: en[f] ?? '', ptText })
    }
    for (const opt of en.options) {
      const ptOpt = entry.options?.[opt.key]
      if (ptOpt) pairs.push({ field: `option.${opt.key}`, enText: opt.text, ptText: ptOpt })
    }

    for (const { field, enText, ptText } of pairs) {
      for (const re of HARD_TERMS) {
        if (re.test(enText) && !re.test(ptText)) {
          hardHits.push(`  [${id}] ${field}: EN tem ${re.source} mas o PT não — ${snippet(enText, re)}`)
        }
      }
      for (const { label, en: enRe, forbiddenPt } of SOFT_TERMS) {
        if (!enRe.test(enText)) continue
        for (const bad of forbiddenPt) {
          if (bad.test(ptText)) {
            softHits.push(`  [${id}] ${field}: "${label}" → PT "${ptText.match(bad)?.[0]}"  ${snippet(ptText, bad)}`)
          }
        }
      }
    }
  }

  if (softHits.length) {
    console.warn(`\n⚠ SOFT — termos técnicos traduzidos (revisar, ${softHits.length}):`)
    softHits.forEach((l) => console.warn(l))
  }
  if (hardHits.length) {
    console.error(`\n✗ HARD — identificadores ausentes no PT (${hardHits.length}):`)
    hardHits.forEach((l) => console.error(l))
  }

  if (!hardHits.length && !softHits.length) {
    console.log('✓ PT glossary OK — nenhum termo técnico traduzido indevidamente.')
  } else {
    console.log(`\nResumo: HARD=${hardHits.length}, SOFT=${softHits.length}`)
  }

  process.exit(hardHits.length ? 1 : 0)
}

main()
