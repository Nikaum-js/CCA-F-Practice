import type { Question } from './schema'

// Fallback bank: 10 questions, 2 per domain. Used only if the generated JSON is missing/empty
// (offline / first run before `bun run build:questions`). Questions are original English text.
export const SEED_QUESTIONS: Question[] = [
  // D1 — Agentic Architecture & Orchestration
  {
    id: 'seed-d1-01',
    text: 'In a multi-agent system, a coordinator delegates subtasks to specialized worker agents and combines their outputs. Which orchestration property most directly reduces wasted wall-clock time when subtasks are independent?',
    options: [
      { key: 'A', text: 'Running each subtask sequentially to preserve ordering' },
      { key: 'B', text: 'Fanning out independent subtasks to run concurrently' },
      { key: 'C', text: 'Giving every worker the full conversation history' },
      { key: 'D', text: 'Using a single agent with a longer context window' },
    ],
    correctKey: 'B',
    explanation:
      'Independent subtasks have no data dependency, so fanning them out concurrently makes wall-clock time track the slowest task rather than the sum of all tasks.',
    domain: 'agentic_architecture',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  {
    id: 'seed-d1-02',
    text: 'You want a subagent to return structured data to its parent rather than a human-facing message. What is the most reliable way to enforce this?',
    options: [
      { key: 'A', text: 'Ask politely in the prompt for JSON' },
      { key: 'B', text: 'Provide a tool/schema the subagent must call to return its result' },
      { key: 'C', text: 'Increase the temperature so it is more creative' },
      { key: 'D', text: 'Tell it to never use natural language ever' },
    ],
    correctKey: 'B',
    explanation:
      'Forcing the model to emit through a defined schema/tool validates the shape at the call boundary and makes the parent able to consume it without brittle parsing.',
    domain: 'agentic_architecture',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  // D2 — Tool Design & MCP Integration
  {
    id: 'seed-d2-01',
    text: 'When defining a tool for Claude, which practice most improves the model’s ability to call it correctly?',
    options: [
      { key: 'A', text: 'A vague description so the model stays flexible' },
      { key: 'B', text: 'A precise description and a strict JSON schema for inputs' },
      { key: 'C', text: 'Omitting the schema to reduce token usage' },
      { key: 'D', text: 'Returning errors as plain prose only' },
    ],
    correctKey: 'B',
    explanation:
      'A clear description plus a strict input schema gives the model unambiguous guidance and lets the platform validate arguments before execution.',
    domain: 'tools_mcp',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  {
    id: 'seed-d2-02',
    text: 'What is the primary purpose of the Model Context Protocol (MCP)?',
    options: [
      { key: 'A', text: 'To fine-tune the underlying model weights' },
      { key: 'B', text: 'To standardize how applications expose tools and context to LLMs' },
      { key: 'C', text: 'To compress the context window automatically' },
      { key: 'D', text: 'To replace the need for system prompts' },
    ],
    correctKey: 'B',
    explanation:
      'MCP is an open protocol that standardizes the connection between LLM applications and external tools/data sources, so integrations are reusable across clients.',
    domain: 'tools_mcp',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  // D3 — Claude Code Configuration & Workflows
  {
    id: 'seed-d3-01',
    text: 'In Claude Code, what is the main role of a CLAUDE.md file at the project root?',
    options: [
      { key: 'A', text: 'It compiles the project' },
      { key: 'B', text: 'It provides persistent project context loaded into each session' },
      { key: 'C', text: 'It stores secrets for deployment' },
      { key: 'D', text: 'It is required for the app to run' },
    ],
    correctKey: 'B',
    explanation:
      'CLAUDE.md is conventional project memory: guidance, conventions, and pointers that are loaded into context so the agent behaves consistently across sessions.',
    domain: 'claude_code',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  {
    id: 'seed-d3-02',
    text: 'Which Claude Code mechanism lets you run a shell command automatically before or after a tool call?',
    options: [
      { key: 'A', text: 'Hooks' },
      { key: 'B', text: 'Slash commands' },
      { key: 'C', text: 'The context window' },
      { key: 'D', text: 'Temperature settings' },
    ],
    correctKey: 'A',
    explanation:
      'Hooks are user-configured shell commands the harness executes around events (e.g., before/after a tool), enabling deterministic automation.',
    domain: 'claude_code',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  // D4 — Prompt Engineering & Structured Output
  {
    id: 'seed-d4-01',
    text: 'You need the model to reason through a hard problem before answering. Which technique most directly helps?',
    options: [
      { key: 'A', text: 'Lowering max tokens' },
      { key: 'B', text: 'Asking it to think step by step (chain of thought)' },
      { key: 'C', text: 'Removing the system prompt' },
      { key: 'D', text: 'Setting temperature to 0 always' },
    ],
    correctKey: 'B',
    explanation:
      'Explicitly eliciting step-by-step reasoning gives the model space to work through intermediate steps, improving accuracy on multi-step problems.',
    domain: 'prompt_engineering',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  {
    id: 'seed-d4-02',
    text: 'Which approach best guarantees a response that downstream code can parse reliably?',
    options: [
      { key: 'A', text: 'Request structured output constrained to a schema' },
      { key: 'B', text: 'Ask for "nice formatting"' },
      { key: 'C', text: 'Raise the temperature for variety' },
      { key: 'D', text: 'Use a longer system prompt with no schema' },
    ],
    correctKey: 'A',
    explanation:
      'Constraining the output to a schema (structured output / tool use) makes the response machine-parseable and validates it at the boundary.',
    domain: 'prompt_engineering',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  // D5 — Context Management & Reliability
  {
    id: 'seed-d5-01',
    text: 'A long-running agent conversation is approaching the context window limit. Which strategy preserves continuity most effectively?',
    options: [
      { key: 'A', text: 'Summarize/compact earlier turns to retain key facts' },
      { key: 'B', text: 'Delete the system prompt' },
      { key: 'C', text: 'Increase temperature' },
      { key: 'D', text: 'Stop responding' },
    ],
    correctKey: 'A',
    explanation:
      'Summarizing or compacting older context keeps essential information within the window while freeing tokens, preserving continuity as the conversation grows.',
    domain: 'context_management',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
  {
    id: 'seed-d5-02',
    text: 'What is a primary benefit of prompt caching for a repeated, large system prompt?',
    options: [
      { key: 'A', text: 'It changes the model’s answers' },
      { key: 'B', text: 'It reduces latency and cost for the cached prefix' },
      { key: 'C', text: 'It increases the context window size' },
      { key: 'D', text: 'It disables tool use' },
    ],
    correctKey: 'B',
    explanation:
      'Caching a stable prefix lets the provider skip recomputing it, lowering latency and cost on subsequent calls that reuse the same prefix.',
    domain: 'context_management',
    classifiedBy: 'curated',
    difficulty: 'normal',
    source: 'merged',
  },
]
