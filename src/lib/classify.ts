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
// `classifiedBy: 'curated'`. Every question in the bank is curated here, so domain
// assignment no longer depends on the keyword heuristic above (kept only as a fallback for
// future un-curated questions). Each entry was reviewed against the OFFICIAL CCA-F exam
// guide's domain task statements (see specs / guide.pdf), with a verification pass over the
// overlap-prone cases (hooks→D1, single-tool error→D2 vs cross-agent propagation→D5,
// tool_choice-for-extraction→D4 vs tool-ordering/selection→D2, decomposition→D1 vs
// review-architecture→D4, ambiguity/escalation→D5). Note: the two source repos cover D2/D4/D5
// heavily, barely touch D1, and contain no genuine D3 (Claude Code config) questions.
export const DOMAIN_OVERRIDES: Record<string, DomainKey> = {
  // D1 Agentic Architecture & Orchestration — 8 questions
  '1f14fee25d': 'agentic_architecture', // When the agent calls `lookup_order` and receives order
  '41a21eb6c1': 'agentic_architecture', // Your expense reimbursement agent processes employee requests
  '4541e02fa8': 'agentic_architecture', // After web search and document analysis subagents finish
  '4d33397a9d': 'agentic_architecture', // An agent is responsible for reviewing pull requests.
  '62185891f6': 'agentic_architecture', // A coordinator provides exact search queries, source prioriti
  '650fd1990f': 'agentic_architecture', // A document analysis subagent processes citations in complex
  'dc300c4998': 'agentic_architecture', // Compliance requires that refunds exceeding $500 must automat
  'e0505f7f0e': 'agentic_architecture', // You are using an agent to analyze a

  // D2 Tool Design & MCP Integration — 31 questions
  '04220637d9': 'tools_mcp', // An agent tracks shipments using tools that call
  '11027b19d2': 'tools_mcp', // An agent needs to query specific internal databases,
  '182580571a': 'tools_mcp', // An agent has access to an `archive_file` tool
  '2232922432': 'tools_mcp', // Your shipment tracking tool queries multiple carriers (FedEx
  '28f9e3e419': 'tools_mcp', // When implementing your `lookup_order` MCP tool, the backend
  '2dc254abcf': 'tools_mcp', // Your `search_documents(query)` tool returns results as plain
  '30221f3a75': 'tools_mcp', // An agent processes employee reimbursements. Company policy d
  '3b49ea7c59': 'tools_mcp', // Your `process_refund` tool returns two types of errors:
  '5a0072f82e': 'tools_mcp', // Your product search tool queries an external catalog
  '64698822da': 'tools_mcp', // Your `update_user_profile` tool accepts a `user_id` (require
  '6846603a1e': 'tools_mcp', // Your content curation agent discovers articles, analyzes eac
  '6a558842af': 'tools_mcp', // Your agent is handling a billing dispute. After
  '75230c4d07': 'tools_mcp', // During execution, an agent repeatedly struggles to format
  '8f50597c35': 'tools_mcp', // Your MCP server implements a `check_availability` tool that
  '9676e6b8c2': 'tools_mcp', // Your agent includes an `update_game_score` tool that accepts
  '98569342e8': 'tools_mcp', // Your `search_documents` tool needs a parameter to specify
  '986a65cf13': 'tools_mcp', // A search tool automatically fetches and returns all
  'ab36cbad5b': 'tools_mcp', // An agent frequently executes a two-step sequence: it
  'b291a2bf1d': 'tools_mcp', // An agent updates sports scores using an `update_game_score(d
  'be59ccc543': 'tools_mcp', // An agent uses a `search_documents` tool to find
  'c13a87d6fd': 'tools_mcp', // An agent has access to over 50 different
  'c8c068bff6': 'tools_mcp', // A pipeline uses an `extract_metadata` tool that returns
  'ca1838c6cf': 'tools_mcp', // Your order management system requires tools for three
  'ce0c910ed1': 'tools_mcp', // Your marketing agent connects to MCP servers from
  'cfbebfba23': 'tools_mcp', // Your `search_flights` tool calls an external airline API
  'd5e09ba10f': 'tools_mcp', // Your document extraction tool uses ML models to
  'd6717a0db8': 'tools_mcp', // A third-party Model Context Protocol (MCP) server provides
  'de8da76eb2': 'tools_mcp', // A tool experiences two types of errors: transient
  'e076d9a4e3': 'tools_mcp', // An agent interacting with multiple Model Context Protocol
  'f1423d751b': 'tools_mcp', // Production logs reveal inconsistent error handling: when `lo
  'f4b33428eb': 'tools_mcp', // Your `track_shipment(tracking_id)` tool raises a Python exce

  // D3 Claude Code Configuration & Workflows — 0 questions
  // (none — source repos do not cover this domain)

  // D4 Prompt Engineering & Structured Output — 24 questions
  '0690905067': 'prompt_engineering', // The system extracts candidate information (name, contact det
  '1c45bbb468': 'prompt_engineering', // An extraction system has operated with 100% human
  '1e585414db': 'prompt_engineering', // Your fitness coaching assistant correctly adapts to explicit
  '2e9c9c8911': 'prompt_engineering', // After your daily batch of 10,000 documents completes,
  '372b5938c9': 'prompt_engineering', // You are preparing to process 50,000 legacy documents
  '3fc50309ba': 'prompt_engineering', // When designing agentic workflows, what is the primary
  '415f6bb17a': 'prompt_engineering', // The system processes product reviews using tool use
  '56b2e43717': 'prompt_engineering', // Your extraction pipeline validates outputs against JSON sche
  '6827424889': 'prompt_engineering', // Users report that responses feel repetitive across turns
  '69de18f837': 'prompt_engineering', // Your extraction pipeline processes contracts that frequently
  '808dda86d7': 'prompt_engineering', // Your system extracts event metadata (date, location, organiz
  '816ad373d6': 'prompt_engineering', // Your system processes asynchronous user requests with a
  '956cb39c59': 'prompt_engineering', // Your extraction system processes two document types: standar
  '9b15add885': 'prompt_engineering', // Your extraction pipeline processes restaurant menus and must
  '9d57536bdf': 'prompt_engineering', // An extraction pipeline processes technical manuals. A specif
  'a29dd8c0f7': 'prompt_engineering', // Your music discovery assistant should consistently maintain
  'b3de307bcf': 'prompt_engineering', // Your pipeline processes 8,000 product listings daily using
  'b3f96bc34e': 'prompt_engineering', // Documents arrive continuously throughout business hours and
  'b665fcd232': 'prompt_engineering', // Specifications sometimes conflict within source documents. A
  'bbe160f9ce': 'prompt_engineering', // Your team is extracting structured data from 50,000
  'd845e137fa': 'prompt_engineering', // Your extraction uses tool use with a JSON
  'e5593e48bd': 'prompt_engineering', // An automated invoice extraction pipeline occasionally output
  'e79c486b98': 'prompt_engineering', // Your schema includes a `skills: string[]` field. Production
  'e813dfc200': 'prompt_engineering', // Your extraction system parses e-commerce product description

  // D5 Context Management & Reliability — 29 questions
  '016dae4da0': 'context_management', // Your research orchestrator dispatches five worker agents in
  '0a5df405dd': 'context_management', // During initial testing, you notice Claude doesn't remember
  '32175a4552': 'context_management', // A multi-agent research pipeline crashes after processing 12
  '369215a9f9': 'context_management', // A web search agent gathers 120k tokens of
  '3d944eeaf1': 'context_management', // During QA testing, Claude follows your system prompt
  '466ecb1bb9': 'context_management', // Performance analysis reveals your context is composed of
  '4946507b7e': 'context_management', // Final reports consistently mishandle uncertainty. For exampl
  '4e4a5ca64f': 'context_management', // A customer raises three separate issues during one
  '4f00b64507': 'context_management', // After a 40-minute session, the conversation has grown
  '5acee69a7a': 'context_management', // The agent verifies customer identity through a multi-step
  '5c538bcd9b': 'context_management', // After investigating a billing dispute over 25+ turns,
  '6e5395d97d': 'context_management', // A customer sends: 'This is frustrating. I've explained
  '6f2bcffa03': 'context_management', // A new user's first message is 'Set up
  '7f6cff4b53': 'context_management', // In a production environment, follow-up summarization queries
  'a594ff611d': 'context_management', // During a billing dispute resolution, your agent successfully
  'b197840e72': 'context_management', // An extraction system uses a 12-field JSON schema
  'bbb075dcfb': 'context_management', // You're implementing a feature where users refine their
  'c39de30c6c': 'context_management', // A customer writes: 'I've been going back and
  'cb710d580e': 'context_management', // Users report that API latency increases noticeably and
  'cb8d6d1d0b': 'context_management', // After three months of weekly sessions, your conversation
  'db672b1ac8': 'context_management', // After deploying an updated system prompt that improves
  'dccc54a396': 'context_management', // Users report the AI loses track of specific
  'df1160e732': 'context_management', // Your `post_content` tool requires user confirmation before p
  'e131656c08': 'context_management', // After a daily batch of 10,000 documents completes
  'e54b0d070b': 'context_management', // A customer returns 4 hours after their initial
  'edd629b9e3': 'context_management', // Your research assistant helps users analyze academic papers
  'fe0e6fd448': 'context_management', // A synthesis agent receives findings from upstream agents
  'fe8eaa1243': 'context_management', // Your agent has called `lookup_order` multiple times while
  'fe97d60451': 'context_management', // Your conversational assistant frequently generates multiple
}
