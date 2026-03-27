import { DOMAIN_ORDER, type DomainKey } from '../data/schema'

// Weighted keyword table. Specific/multi-word terms outweigh generic ones so that a question
// merely mentioning "agent" does not dominate. Word-boundary matching avoids substring noise
// (e.g. "rag" inside "storage", "role" inside "control").
type Weighted = [term: string, weight: number]

const KEYWORDS: Record<DomainKey, Weighted[]> = {
  agentic_architecture: [
    ['multi-agent', 3],
    ['subagent', 3],
    ['orchestrat', 3],
    ['handoff', 3],
    ['coordinator', 3],
    ['agentic', 2],
    ['delegate', 2],
    ['workflow', 2],
    ['pipeline', 2],
    ['research system', 2],
    ['orchestration', 2],
  ],
  tools_mcp: [
    ['mcp', 3],
    ['tool use', 3],
    ['tool definition', 3],
    ['tool result', 3],
    ['tool choice', 3],
    ['function call', 3],
    ['json schema', 3],
    ['input schema', 3],
    ['parameter', 2],
    ['schema', 2],
    ['tool', 1],
  ],
  claude_code: [
    ['claude code', 3],
    ['bash tool', 3],
    ['computer use', 3],
    ['/compact', 3],
    ['slash command', 3],
    ['headless', 3],
    ['code generation', 3],
    ['cli', 2],
    ['hook', 2],
    ['repository', 1],
  ],
  prompt_engineering: [
    ['system prompt', 3],
    ['chain of thought', 3],
    ['few-shot', 3],
    ['structured output', 3],
    ['structured data', 3],
    ['xml tag', 3],
    ['data extraction', 3],
    ['extraction', 2],
    ['temperature', 2],
    ['prompt', 2],
    ['role', 1],
  ],
  context_management: [
    ['context window', 3],
    ['prompt caching', 3],
    ['long context', 3],
    ['retrieval', 3],
    ['reliability', 3],
    ['hallucinat', 3],
    ['guardrail', 3],
    ['rate limit', 3],
    ['error handling', 3],
    ['summariz', 2],
    ['compress', 2],
    ['memory', 2],
    ['caching', 2],
    ['token', 2],
    ['retry', 2],
    ['fallback', 2],
    ['latency', 2],
    ['evaluat', 2],
    ['rag', 2],
  ],
}

function countMatches(haystack: string, term: string): number {
  // Multi-word or symbol-bearing terms: plain substring. Single words: word-boundary regex.
  if (/[^a-z]/.test(term)) {
    let count = 0
    let idx = haystack.indexOf(term)
    while (idx !== -1) {
      count += 1
      idx = haystack.indexOf(term, idx + term.length)
    }
    return count
  }
  const re = new RegExp(`\\b${term}`, 'g') // prefix-boundary: matches term and its inflections
  const m = haystack.match(re)
  return m ? m.length : 0
}

/*
  Best-effort auto classification over the question text (+ options + an optional source hint).
  The hint (a scenario/section title from the source repo) is a strong prior — callers should
  weight it by repeating it in the input string. Ties / zero-score fall back to domain order.
*/
export function classifyDomain(text: string): DomainKey {
  const hay = text.toLowerCase()
  let best: DomainKey = DOMAIN_ORDER[0]
  let bestScore = -1
  for (const d of DOMAIN_ORDER) {
    let score = 0
    for (const [term, weight] of KEYWORDS[d]) score += countMatches(hay, term) * weight
    if (score > bestScore) {
      bestScore = score
      best = d
    }
  }
  return best
}

// Curation authority: map a question id → its reviewed domain. Overrides win and mark
// `classifiedBy: 'curated'`. Populate after reviewing src/data/questions.generated.json.
export const DOMAIN_OVERRIDES: Record<string, DomainKey> = {}
