# CCA-F — Banco de Questões (apenas enunciado e alternativas)

> Claude Certified Architect – Foundations. 33 questões. Sem respostas/explicações.

---

## Q1

An automated invoice extraction pipeline occasionally outputs structured JSON where the extracted line items do not add up to the total amount extracted from the invoice. What is the best architectural approach to handle this semantic error?

- A) Add a `calculated_total` field alongside the `stated_total` field, compare them, and flag mismatches for human review.
- B) Automatically adjust the line item values so they mathematically sum to the stated total.
- C) Introduce a secondary LLM step to reconcile the math errors.
- D) Add more few-shot examples of correct math to the prompt.

---

## Q2

You are preparing to process 50,000 legacy documents using the Batch API. An initial test on 500 documents reveals that 18% of them require 2-3 prompt refinements to extract data correctly. What is the most cost-efficient strategy for scaling this workload?

- A) Refine the prompt interactively on a representative sample to maximize first-pass success, then process all 50,000 documents via the Batch API.
- B) Use the Batch API to process all 50,000 documents immediately, identify failures at scale, and resubmit them.
- C) Process the 50,000 documents using the synchronous API to handle prompt refinement dynamically per document.
- D) Begin submitting 5,000-document batches to incrementally learn failure modes in production.

---

## Q3

Your system processes asynchronous user requests with a strict Service Level Agreement (SLA) requiring results within 30 hours of submission. You plan to use the Message Batches API, which can take up to 24 hours to complete. Which batch submission schedule best meets the SLA while maximizing cost efficiency?

- A) Submit batches every 6 hours.
- B) Submit one large batch at the end of each day.
- C) Use the synchronous API instead to guarantee the SLA.
- D) Submit batches every 4 hours.

---

## Q4

An extraction pipeline processes technical manuals. A specific manual lists two conflicting battery capacities: one in the text and a different one in a detailed specs table. Historical data shows the specs table is correct 90% of the time. How should the extraction schema handle this?

- A) Halt processing and flag the document for manual correction before extraction.
- B) Use a single-value schema and prompt the model to pick the most likely correct value.
- C) Hard-code a rule to always extract the value from the specs table.
- D) Change the field to capture all conflicting values along with their source locations to preserve provenance for downstream reconciliation.

---

## Q5

An agent uses a `search_documents` tool to find files, and subsequently uses `share_document(document_id, email)` and `move_document(document_id, folder)` to act on them. How should the `search_documents` tool format its output to ensure reliable chaining?

- A) Return clickable human-readable URLs.
- B) Return structured data containing `document_id` and metadata for each result.
- C) Return detailed prose summaries of the document contents.
- D) Return a simple list of document titles.

---

## Q6

When designing agentic workflows, what is the primary advantage of enforcing structured JSON output for tool responses and agent outputs?

- A) It makes the LLM's reasoning process perfectly deterministic.
- B) It ensures the semantic truth of the data fetched from backend APIs.
- C) It significantly reduces token consumption compared to standard text.
- D) It allows the agent and downstream systems to reliably access specific fields directly without parsing free-form text.

---

## Q7

An agent has access to over 50 different API connector tools. During execution, it frequently selects the wrong connector, even when explicitly instructed to search first. What is the most effective architectural change to fix this tool selection failure?

- A) Rewrite the tool descriptions for all 50 connectors to be more detailed.
- B) Combine all 50 connectors into a single monolithic API call.
- C) Implement better error handling so the agent can recover after selecting the wrong connector.
- D) Provide a `search_connectors` tool that dynamically scopes the available tool set, exposing only the relevant matched connectors to the agent.

---

## Q8

An agent needs to query specific internal databases, but users often refer to them using ambiguous natural language (e.g., "research database" instead of "db_res_01"). How should the tool's input schema be designed to handle this reliably?

- A) Use an enum parameter explicitly listing the allowed database system names.
- B) Use a freeform string parameter and use backend fuzzy matching to find the right database.
- C) Allow freeform strings but reject the tool call at runtime if the name is incorrect.
- D) Default to searching all databases simultaneously if the user is ambiguous.

---

## Q9

A search tool automatically fetches and returns all matching records from a database. This frequently causes severe latency and context bloat, as most agent tasks only need the first few results. What is the best way to redesign this tool's output?

- A) Silently limit the results to the top 5 most relevant hits.
- B) Return the first page of results along with pagination metadata (e.g., total count, cursor) so the agent can fetch more if needed.
- C) Create a separate `fetch_next_page` tool for the agent to use.
- D) Add a `max_pages` parameter to let the agent decide how many pages to fetch internally.

---

## Q10

A third-party Model Context Protocol (MCP) server provides tools annotated with `readOnlyHint=true`. You are designing the user confirmation flow for your agent application. How should you treat these tool annotations?

- A) Trust the annotations automatically because the MCP server runs locally.
- B) Treat the annotations as untrusted metadata, and base your confirmation bypass policy on your trust of the vendor/server, not the self-reported labels.
- C) Infer the server's trustworthiness by testing the tools in a sandbox first.
- D) Bypass user confirmations safely, as the `readOnlyHint` guarantees no destructive actions can occur.

---

## Q11

An agent frequently executes a two-step sequence: it calls `get_property_details(property_id)` to find an address, then passes that address to `get_neighborhood_info(address)`. This chaining increases latency and failure rates. How should the tool design be improved?

- A) Merge both tools into a single `get_all_property_data` tool.
- B) Modify `get_neighborhood_info` to accept `property_id` directly and resolve the address internally.
- C) Improve the prompt to ensure the agent extracts the address more reliably.
- D) Create a middle-tier helper tool to manage the data handoff.

---

## Q12

An agent tracks shipments using tools that call multiple different shipping carrier APIs. Each carrier returns timestamps, statuses, and delay codes in completely different JSON formats. How should you design the tool output provided to the agent?

- A) Pass the raw JSON to the agent and provide extensive prompt instructions on how to parse each carrier's format.
- B) Normalize the carrier responses into a single common schema (e.g., `status`, `estimated_delivery`) before returning it to the agent.
- C) Create separate tracking tools for each carrier to keep the raw schemas distinct.
- D) Return both the normalized schema and the full raw response to maximize context.

---

## Q13

An agent updates sports scores using an `update_game_score(date, team_name)` tool. The tool frequently fails due to ambiguous team nicknames, rematches on the same day, and date format variations. What is the most reliable tool design to fix this?

- A) Require strict ISO-8601 date formats and official full team names in the tool schema.
- B) Improve the tool description to provide examples of correct formatting.
- C) Add regex validation to the tool parameters to catch formatting errors early.
- D) Introduce a `search_games` tool that returns a `game_id`, and update the scoring tool to accept only the `game_id`.

---

## Q14

An agent processes employee reimbursements. Company policy dictates that payouts over $500 must go to a pending approval queue and cannot be disbursed automatically. You need to ensure this threshold absolutely cannot be bypassed by the agent. Where should this rule be enforced?

- A) Add a `requires_approval` boolean parameter to the tool schema that the agent must set.
- B) Enforce the $500 threshold inside the `process_reimbursement` tool logic itself.
- C) Write a strict system prompt instructing the agent to never disburse amounts over $500.
- D) Provide two separate tools (`disburse` and `request_approval`) and trust the agent to select correctly.

---

## Q15

During execution, an agent repeatedly struggles to format inputs correctly for `user_id` and `fields_to_update` when calling an update tool. What is the most effective way to help the model understand exactly what values and formats to provide?

- A) Write clear, detailed parameter descriptions in the tool schema.
- B) Make the JSON schema extremely strict with complex regex constraints.
- C) Rename the tool to include formatting hints in the tool name itself.
- D) Add error-handling logic that explains the formatting rules only when the tool fails.

---

## Q16

A tool experiences two types of errors: transient network timeouts, and permanent user syntax errors. How should the tool handle these errors to optimize the agent workflow?

- A) Pass all errors to the agent and prompt it to retry timeouts but stop on syntax errors.
- B) Automatically retry transient network timeouts inside the tool, but immediately return syntax errors with clear validation details to the agent.
- C) Uniformly auto-retry all errors 3 times before returning a failure message to the agent.
- D) Return all errors immediately to the agent as generic 'Tool Execution Failed' messages.

---

## Q17

An agent has access to an `archive_file` tool and a `delete_file` tool. It frequently calls `delete_file` when it should have archived a backup file. What is the most direct way to fix this tool selection error?

- A) Expand the tool descriptions to clearly define the purpose, boundaries, and specific scenarios where archiving is preferred over deleting.
- B) Add a confirmation prompt directly inside the `delete_file` tool logic.
- C) Remove the `delete_file` tool entirely and handle deletions via a separate batch process.
- D) Provide few-shot examples in the system prompt showing correct usage.

---

## Q18

You are using an agent to analyze a 12-file codebase. After the agent completes its initial review, a developer modifies 3 of the files. You want the agent to update its findings efficiently. What is the best approach?

- A) Resume the session, explicitly inform the agent which 3 files changed, and instruct it to re-analyze only those files in the context of its prior findings.
- B) Start a completely fresh session and have the agent re-analyze all 12 files from scratch.
- C) Resume the session but don't explicitly mention the changes, trusting the agent to notice the file diffs organically.
- D) Create a new session containing only the 3 modified files, discarding the context of the other 9 files.

---

## Q19

An agent interacting with multiple Model Context Protocol (MCP) servers wastes significant context and time performing sequential lookup calls just to discover what data (issue tickets, docs, schemas) is available. How can you improve data discovery?

- A) Consolidate all the MCP servers into a single, massive endpoint.
- B) Add a new `discover_data` tool to every MCP server.
- C) Implement keyword-based routing in the coordinator to send queries to the right server automatically.
- D) Expose each MCP server's content catalog as an MCP Resource, allowing the agent to read what data exists before making targeted tool calls.

---

## Q20

An agent is responsible for reviewing pull requests. Every PR must be reviewed for three specific aspects: code style, security vulnerabilities, and documentation accuracy. Which architectural pattern is best suited for this workflow?

- A) Dynamic subagent decomposition, letting a coordinator agent decide which aspects to check case-by-case.
- B) A routing agent that categorizes the PR and sends it to either a style, security, or docs specialist.
- C) A single, massive prompt instructing one agent to analyze all three aspects simultaneously.
- D) Prompt chaining: reviewing style, security, and documentation in separate sequential passes, then merging the outputs into a final synthesis.

---

## Q21

In a production environment, follow-up summarization queries to a multi-agent system take over 40 seconds. Investigation shows the coordinator agent spawns a synthesis subagent for each follow-up request, passing 80000 tokens of accumulated findings. The coordinator already holds these findings in its context from orchestrating the initial research. What is the most effective way to improve response time for these follow-up summaries?

- A) Compress findings before passing them to the synthesis subagent.
- B) Increase the synthesis subagent's context window.
- C) Handle the summarization directly using the coordinator's existing context.
- D) Cache synthesis subagent responses.
- E) Use `fork_session` to speed up subagent spawning.

---

## Q22

After web search and document analysis subagents finish their tasks, the coordinator needs to spawn a synthesis subagent to combine the findings. What is the correct approach for providing the synthesis subagent with the information it needs?

- A) Let the synthesis subagent call the search and analysis tools itself.
- B) Let the synthesis subagent read directly from the coordinator's session history.
- C) Pass a prose summary of the findings to the synthesis subagent.
- D) Pass complete findings embedded directly in the synthesis subagent's prompt using a structured format separating content from metadata.

---

## Q23

A coordinator provides exact search queries, source priorities, and date filters step-by-step to a web search subagent. However, the subagent often reports "insufficient results" instead of trying alternatives, drops in quality on emerging topics, and rarely surfaces unconventional sources. What is the most effective way to improve the subagent's adaptability?

- A) Add a fallback instruction to report failure if fewer than 5 results are found.
- B) Replace procedural instructions with goal-oriented prompts detailing research goals and quality criteria.
- C) Expand the exact query lists to cover emerging topics.
- D) Provide generic, single-word queries to broaden the search base.

---

## Q24

A document analysis subagent processes citations in complex legal cases sequentially. A landmark case citing 12 precedents currently takes over 3 minutes to process. What is the most effective way to reduce this latency?

- A) Increase the subagent's context window.
- B) Have the coordinator emit multiple Task tool calls simultaneously in a single response.
- C) Use `fork_session` to speed up processing.
- D) Use the Message Batches API.

---

## Q25

Final reports consistently mishandle uncertainty. For example, a web search agent returns a $50B estimate (unspecified methodology), while a document analysis agent returns a $35B estimate (±$7B, 95% CI). The coordinator either picks one arbitrarily or produces a vague, hedged statement. What approach best avoids this?

- A) Instruct the coordinator to always prefer peer-reviewed sources.
- B) Ask the synthesis subagent to pick the most recent figure.
- C) Have the coordinator average the two conflicting values.
- D) Require subagents to return structured data with methodology/confidence metadata and a `conflict_detected` flag to preserve both values.

---

## Q26

A web search agent gathers 120k tokens of raw content, a document analysis agent extracts 15k tokens of insights, and a synthesis agent produces a 3k-token narrative draft. The coordinator must now pass context to a report generation agent for final output with proper citations. Which context-passing strategy provides the best balance of completeness and efficiency?

- A) Pass the 120k tokens of raw content and all intermediate outputs.
- B) Pass only the 3k-token synthesis narrative.
- C) Pass the synthesis narrative and the full document analysis reasoning chain.
- D) Pass the synthesis narrative along with a lean, structured citation index and conflict flags.

---

## Q27

A synthesis agent receives findings from upstream agents and passes a consolidated prose summary to a report generation agent. During testing, the report generator makes factual claims but cannot accurately attribute them because source metadata was lost during the summarization step. What is the most effective approach to ensure proper source attribution?

- A) Ask the synthesis agent to re-include the full source text in its summary.
- B) Assign a `citation_id` at the earliest agent, and require the synthesis agent to produce an inline-tagged narrative alongside a preserved structured citation index.
- C) Instruct the report agent to infer the original sources from the claim content.
- D) Instruct the synthesis agent to "preserve sources" in its prose output.

---

## Q28

A multi-agent research pipeline crashes after processing 12 out of 18 documents. Each agent has partially completed work. You need to resume the pipeline without losing the fidelity of prior findings or repeating completed work. What is the best state management approach?

- A) Run the `--resume` command directly on the crashed session.
- B) Use `fork_session` from the crash point to branch the execution.
- C) Write completed findings to a structured checkpoint file, start a fresh session, and inject the checkpoint as structured context.
- D) Resume the session without noting partial document states.

---

## Q29

During research on "renewable energy adoption," a web search agent returns statistics from 2024, while a document analysis agent returns statistics from 2021. The synthesis agent incorrectly flags these as contradictory rather than recognizing a growth trend over time. What single change best enables the synthesis agent to correctly interpret this difference?

> _Questão aberta — sem alternativas no material de origem._

---

## Q30

An extraction system has operated with 100% human review for 3 months. Analysis shows that extractions with a model confidence of >=90% have a 97% accuracy overall. To reduce reviewer workload, you plan to automate high-confidence extractions. Before deploying, what validation step is most critical?

- A) Segment the accuracy metrics by document type and field.
- B) Deploy the automation globally at the >=90% confidence threshold.
- C) Run a random sample review across all documents before deploying.
- D) Increase the confidence threshold to >=95% just to be safe.

---

## Q31

After a daily batch of 10,000 documents completes processing, 300 documents (3%) fail with `context_length_exceeded` errors. The result file identifies each failure by its `custom_id`. What is the most cost-effective approach to process these failures?

- A) Resubmit all 10,000 documents with a smaller chunk size.
- B) Switch the 300 failed documents to the synchronous API.
- C) Extract only the 300 failed documents using their `custom_id`, chunk them, and resubmit them as a new batch.
- D) Increase the context window limit globally.

---

## Q32

An extraction system uses a 12-field JSON schema and detailed tool descriptions totaling ~2,500 tokens. For documents under 150k tokens, accuracy is 98%. However, for documents between 175k-185k tokens, accuracy drops to 71%, with information from the final third of the document consistently missing. The model's context window is 200k tokens. What is the most likely cause of this degradation?

- A) The tool definition consumes input tokens, and combined with system prompts, pushes the total input close to the context limit, degrading attention for content at the end.
- B) Schemas exceeding 8-10 fields inherently increase decision complexity.
- C) Very long documents exceed the model's effective attention span causing middle-document degradation.
- D) The model distributes attention proportionally, causing the end of the document to receive insufficient focus.

---

## Q33

A pipeline uses an `extract_metadata` tool that returns a DOI. It also has `lookup_citations` and `verify_doi` enrichment tools that require a DOI to function. When users ask to "extract the metadata and tell me how cited it is", the model sometimes calls the enrichment tools first, which fail because they lack the DOI. What is the most effective way to ensure structured metadata extraction happens first?

- A) Add a prompt instruction to "always call `extract_metadata` first."
- B) Set `tool_choice` to strictly force the `extract_metadata` tool on the first turn, then use `tool_choice: "auto"` for subsequent turns.
- C) Combine all three tools into a single massive tool.
- D) Use `tool_choice: "auto"` but restrict the descriptions of the enrichment tools.
