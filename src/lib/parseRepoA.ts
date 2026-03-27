import type { AnswerKey } from '../data/schema'
import type { RawQuestion } from './sourceTypes'

// Parser for mrKindly/claude-certified-architect.
// Format: "### Question N of N" counter; bold question line below; options "- A:"; answer
// "**✅ Correct Answer: X**"; explanation in a "> **Explanation:**" blockquote. See contracts/parsers.md.

const EMOJI = /[✅\u{1F4A1}\u{1F3A7}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}✀-➿]/gu

function clean(s: string): string {
  return s.replace(EMOJI, '').replace(/\s+/g, ' ').trim()
}

export function parseRepoA(markdown: string): RawQuestion[] {
  const lines = markdown.split('\n')
  const out: RawQuestion[] = []

  // H2 scenario sections (e.g. "## Scenario 3: Code Generation with Claude Code") used as a
  // domain prior. Question headings are H3 ("### Question N of N").
  const sections: { index: number; title: string }[] = []
  const sectionRe = /^##\s+(?!#)(.+)$/
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(sectionRe)
    if (m && !/Question\s+\d+/i.test(m[1])) sections.push({ index: i, title: clean(m[1]) })
  }
  const hintFor = (lineIdx: number): string | undefined => {
    let title: string | undefined
    for (const s of sections) {
      if (s.index < lineIdx) title = s.title
      else break
    }
    return title
  }

  // indices of question headings
  const heads: number[] = []
  const headRe = /^#{3,4}\s+Question\s+\d+/i
  for (let i = 0; i < lines.length; i++) if (headRe.test(lines[i])) heads.push(i)

  for (let h = 0; h < heads.length; h++) {
    const start = heads[h]
    const end = h + 1 < heads.length ? heads[h + 1] : lines.length
    const block = lines.slice(start + 1, end)

    let text = ''
    const options: { key: AnswerKey; text: string }[] = []
    let correctKey: AnswerKey | null = null
    const explLines: string[] = []
    let inExplanation = false

    for (const rawLine of block) {
      const line = rawLine.trim()
      if (!line) continue

      const opt = line.match(/^[-*]?\s*\*{0,2}([A-D])\*{0,2}\s*[:).]\s*(.+)$/)
      const answer = line.match(/Correct\s*Answer\s*[:=]\s*\*{0,2}\s*([A-D])/i)
      const explStart = /\*\*Explanation/i.test(line) || /^>\s*\*\*Explanation/i.test(line)

      if (answer) {
        correctKey = answer[1].toUpperCase() as AnswerKey
        continue
      }
      if (explStart) {
        inExplanation = true
        const after = line.replace(/^>\s*/, '').replace(/\*\*Explanation:?\*\*/i, '').trim()
        if (after) explLines.push(after)
        continue
      }
      if (inExplanation) {
        explLines.push(line.replace(/^>\s*/, ''))
        continue
      }
      if (opt) {
        options.push({ key: opt[1].toUpperCase() as AnswerKey, text: clean(opt[2]) })
        continue
      }
      // first bold, non-option line before options = the question text
      if (!text && !options.length) {
        const bold = line.match(/^\*\*(.+?)\*\*$/)
        if (bold) text = clean(bold[1])
        else if (!line.startsWith('#') && !line.startsWith('>')) text = clean(line)
      }
    }

    // fallback correctKey: inline ✅ marker inside an option (raw block)
    if (!correctKey) {
      for (const rawLine of block) {
        const m = rawLine.match(/^[-*]?\s*([A-D])\s*[:).].*✅/)
        if (m) {
          correctKey = m[1].toUpperCase() as AnswerKey
          break
        }
      }
    }

    const explanation = clean(explLines.join(' '))
    if (text && options.length === 4 && correctKey && options.some((o) => o.key === correctKey)) {
      out.push({ text, options, correctKey, explanation, source: 'mrKindly', hint: hintFor(start) })
    }
  }

  return out
}
