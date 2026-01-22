# CLAUDE.md — CCA-F Exam Prep App

Manual de bordo para o Claude neste projeto. Carregado em toda sessão. Leia antes de agir.

## O que é

App pessoal, **client-side**, de preparação para a certificação **Claude Certified Architect –
Foundations (CCA-F)**. Estuda-se sozinho: sem auth, sem backend. Todo estado em `localStorage`.

> ⚠️ A certificação é real, mas **domínios/pesos/escala de nota/corte NÃO são oficiais da Anthropic**
> — são consenso de comunidade. Veja o Princípio VI. Única fonte oficial citável:
> https://www.anthropic.com/news/claude-partner-network

<!-- SPECKIT START -->
**Feature ativa:** `specs/002-design-polish/` (Bold Visual Redesign) — plano técnico em
[`plan.md`](specs/002-design-polish/plan.md) (+ research, data-model, contracts, quickstart).
Próximo passo: `/speckit-tasks`. Feature 001 (`specs/001-ccaf-exam-prep/`) já implementada.
<!-- SPECKIT END -->

## Fontes de verdade (ordem de precedência)

1. **`.specify/memory/constitution.md`** — princípios não-negociáveis (I–VII). Supersede tudo.
2. **`specs/<feature>/spec.md`** — o "o quê" de cada feature. Feature atual:
   `specs/001-ccaf-exam-prep/spec.md`.
3. **`specs/<feature>/plan.md`** — o "como" técnico (criado por `/speckit-plan`, **ainda não existe**).
4. Este `CLAUDE.md` — convenções operacionais e atalhos.

Se código e spec divergirem, **a spec vence** (ou emenda-se a spec primeiro).

## Stack travada (mudança = emenda à constituição)

- **Bun** = runtime + package manager. **Vite** = bundler/dev server (rodado via Bun).
- **React 19** + **TypeScript strict**.
- **Tailwind CSS v4** — CSS-first, tokens em `@theme` (OKLCH), tema dark, base **zinc**.
- **shadcn/ui** — componentes em uso: button, card, badge, progress, separator, switch,
  alert-dialog, accordion. (tabs/tooltip só se surgir uso concreto.)
- **Sem** router, **sem** lib de estado externa (só React state + `localStorage`).

## Convenções não-negociáveis (resumo dos princípios)

- **Client-side only**: nada de backend/servidor; estado persistido só em `localStorage` (chaves
  `ccaf_*`). Sem Zustand/Redux.
- **i18n obrigatória**: toda string de UI vem de `translations` (PT/EN). **Proibido hardcode** de
  PT/EN no JSX. Default PT; toggle visível em toda tela (`ccaf_lang`).
- **Inglês é a fonte canônica das questões** (Princípio III, emendado v2.0.0 — feature 003): o texto
  inglês de questão/opções/explicação é a verdade (base do `id`/dedup) e **nunca é sobrescrito**.
  Sobre ele há uma **camada de tradução PT opcional e aditiva** (`src/data/questions.pt.json`, keyed
  por `id`), exibida quando o idioma é PT; **fallback pro inglês** quando falta tradução. Termos/
  identificadores técnicos (`isError`, `user_id`, JSON Schema, MCP) ficam **verbatim**.
- **Dados offline-first**: banco **pré-compilado em build-time** (`scripts/build-questions.ts` →
  `src/data/questions.generated.json`). Sem fetch obrigatório em runtime. Seed de 10 questões garante
  que nunca há tela vazia.
- **Design tokenizado** (Princípio V, emendado v1.1.0 — feature 002): tudo vem de tokens no `@theme`
  (OKLCH), nunca valores ad-hoc. Permitido: Inter **600/700** em display/score/headings (corpo fica
  400/500); **elevação suave tokenizada** (sombras/superfícies em camadas); paleta expandida com
  acentos e cores vívidas por domínio. Proibido: cores/sombras fora dos tokens, emojis na UI de
  produção, contraste abaixo de **WCAG AA** no tema dark.
- **Pesos não-oficiais**: toda UI que mostra pesos/escala/corte deve rotular como não-oficial.

## Chaves de localStorage

`ccaf_questions` (banco cacheado/seed) · `ccaf_lang` · `ccaf_domain_stats` · `ccaf_exam_history`
(só simulado 60q) · `ccaf_session` (sessão em progresso).

## Modelo de dados & regras-chave

- **5 domínios** D1–D5, pesos (comunidade) 27/18/20/20/15.
- **Score (só 60q)**: `round(100 + Σ(accuracy_domínio × peso) × 900)`; aprovado se `≥ 720`.
- **Amostragem ponderada** (`buildWeightedSample`): largest-remainder, total exato (15/30/60).
  Se um domínio não tem questões para a cota → **usa o que tem e redistribui o resto por peso**,
  total exato, **sem repetir** questão na sessão.
- **Stats por domínio**: atualizadas em **todos os modos** (domínio, misto, 15/30, 60).
- **15/30 e misto**: praticam sem nota 100–1000 e sem salvar em `ccaf_exam_history`.
- **Classificação de domínio**: **curada em build-time** (revisável no JSON), não heurística runtime.
- **Pipeline de dados**: 2 repos-fonte, cada um um único `README.md` com **formato bespoke diferente**
  → `parseRepoA` + `parseRepoB` → dedup (mantém explicação mais longa, `source: 'merged'`) →
  classificação curada → `questions.generated.json`.

## Fluxo de trabalho (Spec Kit)

`constitution → specify → clarify → plan → tasks → implement`.

- **Mudança de comportamento** que o usuário vê → passa por spec (`/speckit-specify`).
- **Setup/tooling/refactor/bugfix/docs** → direto, sem spec.
- **Fronteira discovery → construção**: não cruzar (`/speckit-plan` em diante) sem decisão explícita.
  Hoje estamos **em discovery**: constitution + spec + clarify prontos; `plan.md` ainda não existe.

## Estado atual do projeto (2026-06-15)

- ✅ Constitution preenchida (v1.0.0).
- ✅ Spec + plan + research + data-model + contracts + tasks em `specs/001-ccaf-exam-prep/`.
- ✅ Clarifications resolvidas (3 decisões).
- ✅ **App implementado e buildando**: tooling (Bun + Vite + Tailwind v4 + shadcn), pipeline de
  dados (`scripts/build-questions.ts` → `src/data/questions.generated.json`, 92 questões), i18n,
  hooks, telas e componentes. `tsc -b` limpo, `vite build` OK, `bun run dev` sobe.
- ⏭️ Pendências de polimento: **curar a classificação de domínio** (auto via keyword+scenario;
  rever `questions.generated.json` e popular `DOMAIN_OVERRIDES` em `scripts/build-questions.ts`);
  D5 (context) só tem 5 questões — quota do simulado redistribui automaticamente; verificação
  interativa clicando pelo app (build/typecheck já passam).

## Nota de ambiente

No começo da sessão um `pnpm install` pontual (corepack) moveu pacotes do Bun para
`node_modules/.ignored`; reconciliado rodando `bun install`. Stack é **Bun** — usar `bun`/`bunx`.

## Nota

O `docs/SPEC-KIT.md` é um **manual genérico do Spec Kit** herdado de outro projeto (exemplos de um
jogo "Banco Master"). Use-o só como referência de *como* o Spec Kit funciona — **a fonte de verdade
deste app é a constitution + `specs/`**, não aquele documento.
