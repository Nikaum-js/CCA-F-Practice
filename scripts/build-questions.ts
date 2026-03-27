/*
  Build-time question bank compiler. Run with: bun run scripts/build-questions.ts
  Fetches both source READMEs, parses each with a bespoke parser, deduplicates, assigns stable
  ids + domains, and writes src/data/questions.generated.json. Network is needed ONCE; after that
  the app runs fully offline from the generated JSON. See specs/001-ccaf-exam-prep/contracts/parsers.md.
*/
import { createHash } from 'node:crypto'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseRepoA } from '../src/lib/parseRepoA.ts'
import { parseRepoB } from '../src/lib/parseRepoB.ts'
import { dedupe, normalizeText } from '../src/lib/dedupe.ts'
import { classifyDomain, DOMAIN_OVERRIDES } from '../src/lib/classify.ts'
import { DOMAIN_ORDER, type DomainKey, type Question } from '../src/data/schema.ts'

const SOURCES = {
  mrKindly: 'https://raw.githubusercontent.com/mrKindly/claude-certified-architect/HEAD/README.md',
  avidevelops: 'https://raw.githubusercontent.com/avidevelops/claude-architect-exam-prep/HEAD/README.md',
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/data/questions.generated.json')

function sha1(s: string): string {
  return createHash('sha1').update(s).digest('hex').slice(0, 10)
}

function difficultyOf(text: string): 'normal' | 'hard' {
  // best-effort: long / multi-clause prompts → 'hard'
  const wordCount = text.split(/\s+/).length
  return wordCount > 45 || /which of the following|best describes|most appropriate/i.test(text)
    ? 'hard'
    : 'normal'
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  return res.text()
}

async function main() {
  console.log('▸ Fetching source READMEs…')
  const [mdA, mdB] = await Promise.all([fetchText(SOURCES.mrKindly), fetchText(SOURCES.avidevelops)])

  const rawA = parseRepoA(mdA)
  const rawB = parseRepoB(mdB)
  console.log(`  parsed: mrKindly=${rawA.length}, avidevelops=${rawB.length}`)

  const merged = [...rawA, ...rawB]
  const deduped = dedupe(merged)
  console.log(`  merged=${merged.length} → deduped=${deduped.length} (removed ${merged.length - deduped.length})`)

  let curated = 0
  const questions: Question[] = deduped.map((r) => {
    const id = sha1(normalizeText(r.text))
    const override = DOMAIN_OVERRIDES[id]
    // Source scenario/section hint is a strong prior → repeat it to weight it in the classifier.
    const hint = r.hint ? ` ${r.hint}`.repeat(4) : ''
    const domain: DomainKey =
      override ?? classifyDomain(`${r.text} ${r.options.map((o) => o.text).join(' ')}${hint}`)
    if (override) curated += 1
    return {
      id,
      text: r.text,
      options: r.options,
      correctKey: r.correctKey,
      explanation: r.explanation,
      domain,
      classifiedBy: override ? 'curated' : 'auto',
      difficulty: difficultyOf(r.text),
      source: r.source,
    }
  })

  questions.sort((a, b) => DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain) || a.id.localeCompare(b.id))

  const perDomain = DOMAIN_ORDER.map(
    (d) => `${d}=${questions.filter((q) => q.domain === d).length}`,
  ).join(', ')

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(questions, null, 2) + '\n')

  console.log(`✓ Wrote ${questions.length} questions to ${OUT}`)
  console.log(`  per-domain: ${perDomain}`)
  console.log(`  classifiedBy: curated=${curated}, auto=${questions.length - curated}`)

  // Guardrail: the PT layer must keep technical terms verbatim. Soft warns; hard (missing
  // identifier) would exit non-zero. Runs as a child so it never aborts the EN write above.
  console.log('\n▸ Checking PT glossary…')
  const check = Bun.spawnSync(['bun', 'run', resolve(__dirname, 'check-pt-glossary.ts')], {
    stdout: 'inherit',
    stderr: 'inherit',
  })
  if (check.exitCode !== 0) process.exitCode = check.exitCode
}

main().catch((err) => {
  console.error('✗ build-questions failed:', err.message)
  console.error('  The app will fall back to src/data/seed.ts (10 questions).')
  process.exit(1)
})
