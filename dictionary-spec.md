# Spec: Dicionário / Cheat Sheet de Termos (CCA-F)

**Status:** Draft — aguardando aprovação antes do PASSO 3 (implementação)
**Feature:** aba "Dicionário" para estudar rapidamente o vocabulário técnico em inglês que cai na prova
**Data:** 2026-06-16

> Esta spec segue as fontes de verdade do projeto: `.specify/memory/constitution.md` (Princípios I–VII)
> e o `CLAUDE.md`. Ela é apresentada na raiz conforme solicitado; a convenção do repo para features
> maiores é `specs/NNN-feature/`, mas mantive aqui por ser um anexo enxuto e a seu pedido.

## 1. Objetivo & Escopo

Uma aba **client-side** de consulta rápida (cheat sheet) com termos técnicos **em inglês** + tradução
PT-BR + contexto de como o termo é cobrado no exame. Foco em **scannability**: buscar por texto e
filtrar por categoria. Sem backend, sem novas dependências.

**Fora de escopo:** edição/adição de termos pela UI, favoritar, quiz a partir do dicionário,
persistência de estado da aba (a busca/filtro são efêmeros, em React state).

## 2. Conformidade com a Constituição

| Princípio | Como esta feature atende |
|---|---|
| I. Client-Side Only | Dados estáticos compilados; nenhum fetch/backend; nenhuma lib de estado. |
| II. i18n obrigatória | Todo **chrome** (label da aba, placeholder de busca, "nenhum resultado", contagem) vem de `translations.ts` (PT/EN), com toggle visível. |
| III. Inglês canônico | O **termo** é sempre o inglês original (é o objeto de estudo). A `pt` é tradução e o `context` é explicação PT-BR — isto é conteúdo/dados, análogo às questões. |
| IV. Offline-first | `src/data/dictionary.ts` é importado em build-time; funciona offline. |
| V. Design tokenizado | Só tokens do `@theme` (cores/sombras/tipografia), sem valores ad-hoc, sem emojis, contraste AA, foco-visível. Reusa `Card`, `Input`(ou botões shadcn), `Badge`. |
| VI. Pesos não-oficiais | N/A (não exibe pesos/score). |
| VII. Spec-driven | Esta spec + dados primeiro; UI só após aprovação. |

## 3. Estrutura de Dados (tipagem)

Arquivo: **`src/data/dictionary.ts`** (TS tipado, no padrão de `src/data/schema.ts`).

```ts
export type DictionaryCategoryKey = 'ecosystem' | 'verbs' | 'tradeoff' | 'modifiers'

export interface DictionaryCategory {
  key: DictionaryCategoryKey
  pt: string // rótulo PT da categoria
  en: string // rótulo EN da categoria
}

export interface DictionaryTerm {
  term: string                 // termo em inglês (canônico — objeto de estudo)
  pt: string                   // tradução PT-BR
  context: string              // PT-BR: como o termo cai nos cenários do exame
  category: DictionaryCategoryKey
}

export const DICTIONARY_CATEGORIES: DictionaryCategory[]
export const DICTIONARY_TERMS: DictionaryTerm[]
```

Decisões:
- Categoria com `pt`/`en` (mesmo padrão de `DOMAIN_META`) — assim os rótulos respeitam o idioma sem
  poluir `translations.ts` com dados.
- `context` é PT-BR (a feature é auxílio de estudo para falante de PT); pode ganhar um `contextEn`
  opcional no futuro sem quebrar nada.

## 4. Componentes de UI

Tela nova: **`src/screens/DictionaryScreen.tsx`** + componentes em **`src/components/dictionary/`**:

1. **`DictionarySearch`** — campo de busca (input). Filtra por substring case-insensitive em `term`,
   `pt` e `context`. Botão de limpar. Acessível (label, foco-visível). Reusa estilo de input
   tokenizado.
2. **`CategoryFilter`** — fileira de botões/chips por categoria + um "Todas". Clicar alterna o filtro
   ativo (single-select). Categoria ativa destacada com token de acento; estados hover/focus/selected
   distintos. Mostra a contagem por categoria opcionalmente.
3. **`TermCard`** (ou linha de lista) — para cada termo: `term` em destaque (peso de display),
   `pt` como subtítulo, `context` em corpo legível (`leading-relaxed`, medida confortável), e um
   `Badge` discreto com a categoria. Layout enxuto para leitura dinâmica.
4. **Estado vazio** — quando a busca não retorna nada: mensagem i18n "Nenhum termo encontrado".

**Comportamento de filtro:** busca textual **e** filtro de categoria combinam (AND). A lista é
derivada por `useMemo` sobre `DICTIONARY_TERMS`. Tudo em React state local da tela (efêmero).

## 5. Integração na navegação

O app **não tem router** — `App.tsx` troca telas por estado `view`. Integração:

1. `App.tsx`: estender o tipo `View` para incluir `'dictionary'` e renderizar `<DictionaryScreen />`
   quando `view === 'dictionary'`.
2. **Navegação visível**: adicionar um item "Dicionário" no `AppHeader` (que hoje tem só wordmark +
   toggle de idioma) como link/botão de navegação, recebendo `onNavigate('dictionary')` e
   `onNavigate('home')`. O header passa a indicar a aba ativa.
   - `App.tsx` passa `view` + `setView` (ou callbacks) ao `AppHeader`.
3. Dentro da tela, um caminho de volta para Home (botão "← Home" / clicar no wordmark).
4. Label da aba vem de `translations.ts` (`nav.dictionary`, `nav.home`).

> Alternativa considerada e descartada: adicionar uma lib de router — proibido pela Constituição I.

## 6. Strings i18n a adicionar (`translations.ts`, PT + EN)

- `nav.home` · `nav.dictionary`
- `dict.title` · `dict.subtitle`
- `dict.search.placeholder` · `dict.search.clear`
- `dict.filter.all`
- `dict.empty` (nenhum resultado)
- `dict.count` ("{n} termos")

(Os rótulos das categorias vêm de `DICTIONARY_CATEGORIES[].pt/en`, não de `translations.ts`.)

## 7. Conteúdo (categorias e termos)

Definido em `src/data/dictionary.ts` (PASSO 2). 4 categorias, 22 termos:

- **Ecossistema** (8): Few-shot, Prompt Chaining, Fallback, Stop Reason, Tool Use, Hook, Payload, Context Window.
- **Verbos de Ação e Falha** (6): Trigger, Bypass, Enforce, Mock, Parse, Fails silently.
- **Trade-offs** (5): Overhead, Bottleneck, Reliable, Trade-off, Workaround.
- **Modificadores e Pegadinhas** (3): Always, Never, Only.

## 8. Critérios de Aceite

- AC-1: A aba "Dicionário" é alcançável pelo header e volta para Home.
- AC-2: Os 22 termos aparecem com term/pt/context e badge de categoria.
- AC-3: Buscar por texto filtra por `term`, `pt` e `context` (case-insensitive); estado vazio aparece.
- AC-4: Clicar numa categoria filtra; "Todas" limpa; busca + categoria combinam.
- AC-5: Chrome respeita PT/EN; termos permanecem em inglês.
- AC-6: `tsc -b` + `vite build` verdes; sem valores ad-hoc; AA; foco-visível; usável a ~360px.

## 9. Plano de Implementação (PASSO 3 — após aprovação)

1. `src/data/dictionary.ts` (PASSO 2 — já entregue para revisão).
2. Strings i18n em `translations.ts`.
3. `src/components/dictionary/{DictionarySearch,CategoryFilter,TermCard}.tsx`.
4. `src/screens/DictionaryScreen.tsx`.
5. Navegação: `AppHeader` (item de nav + aba ativa) e `App.tsx` (`view='dictionary'`).
6. Build verde + verificação no Playwright (busca, filtro, PT/EN, 360px).
