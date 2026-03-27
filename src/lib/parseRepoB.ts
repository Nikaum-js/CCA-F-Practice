import type { AnswerKey } from '../data/schema'
import type { RawQuestion } from './sourceTypes'

// Parser for avidevelops/claude-architect-exam-prep.
// Format: "### Qn: Title"; "> *Scenario: ...*"; body under "**Question:**"; options "- A) ...";
// answer "**✅ Correct Answer: X — summary**"; explanation across three bold sections.
// See contracts/parsers.md.

const EMOJI = /[✅\u{1F4A1}\u{1F3A7}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}✀-➿]/gu

function clean(s: string): string {
  return s.replace(EMOJI, '').replace(/\s+/g, ' ').trim()
}

export function parseRepoB(markdown: string): RawQuestion[] {
  const lines = markdown.split('\n')
  const out: RawQuestion[] = []

  const heads: number[] = []
  const headRe = /^#{2,4}\s+Q\d+\s*:/i
  for (let i = 0; i < lines.length; i++) if (headRe.test(lines[i])) heads.push(i)

  for (let h = 0; h < heads.length; h++) {
    const start = heads[h]
    const end = h + 1 < heads.length ? heads[h + 1] : lines.length
    const block = lines.slice(start + 1, end)

    const questionParts: string[] = []
    const options: { key: AnswerKey; text: string }[] = []
    let correctKey: AnswerKey | null = null
    const explParts: string[] = []
    let hint: string | undefined

    type Section = 'none' | 'question' | 'options' | 'explanation'
    let section: Section = 'none'

    for (const rawLine of block) {
      const line = rawLine.trim()
      if (!line) continue

      const scenario = line.match(/^>\s*\*?\s*Scenario\s*:?\s*(.+?)\*?\s*$/i)
      if (scenario) {
        hint = clean(scenario[1])
        continue
      }

      const answer = line.match(/Correct\s*Answer\s*[:=]\s*\*{0,2}\s*([A-D])/i)
      if (answer) {
        correctKey = answer[1].toUpperCase() as AnswerKey
        section = 'explanation'
        continue
      }

      if (/^\*\*Question:\*\*/i.test(line)) {
        section = 'question'
        const after = line.replace(/^\*\*Question:\*\*/i, '').trim()
        if (after) questionParts.push(after)
        continue
      }
      if (/^\*\*Options:\*\*/i.test(line)) {
        section = 'options'
        continue
      }
      if (/^\*\*(Why this is correct|Why the others are weaker|Exam Takeaway)/i.test(line)) {
        section = 'explanation'
        const label = line.match(/^\*\*(.+?):?\*\*\s*(.*)$/)
        if (label) {
          const head = clean(label[1])
          const body = clean(label[2])
          explParts.push(body ? `${head}: ${body}` : `${head}:`)
        }
        continue
      }

      const opt = line.match(/^[-*]?\s*\*{0,2}([A-D])\*{0,2}\s*[:).]\s*(.+)$/)
      if (section === 'options' && opt) {
        options.push({ key: opt[1].toUpperCase() as AnswerKey, text: clean(opt[2]) })
        continue
      }
      if (section === 'question') {
        if (/^>\s*\*?Scenario/i.test(line)) continue // skip scenario subtitle
        questionParts.push(clean(line))
        continue
      }
      if (section === 'explanation') {
        explParts.push(clean(line.replace(/^>\s*/, '')))
        continue
      }
    }

    const text = clean(questionParts.join(' '))
    const explanation = clean(explParts.join(' '))
    if (text && options.length === 4 && correctKey && options.some((o) => o.key === correctKey)) {
      out.push({ text, options, correctKey, explanation, source: 'avidevelops', hint })
    }
  }

  return out
}
