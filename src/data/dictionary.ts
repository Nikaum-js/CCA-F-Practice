// Dicionário / Cheat Sheet — vocabulário técnico (inglês) que cai na prova CCA-F.
// O `term` é o inglês canônico (objeto de estudo); `pt` é a tradução e `context` explica como o
// termo aparece nos cenários do exame. Conteúdo de estudo (dados), análogo às questões.

export type DictionaryCategoryKey = 'ecosystem' | 'verbs' | 'tradeoff' | 'modifiers'

export interface DictionaryCategory {
  key: DictionaryCategoryKey
  pt: string // rótulo PT da categoria
  en: string // rótulo EN da categoria
}

export interface DictionaryTerm {
  term: string // termo em inglês (canônico)
  pt: string // tradução PT-BR
  context: string // PT-BR: como o termo é cobrado nos cenários do exame
  category: DictionaryCategoryKey
}

export const DICTIONARY_CATEGORIES: DictionaryCategory[] = [
  { key: 'ecosystem', pt: 'Ecossistema', en: 'Ecosystem' },
  { key: 'verbs', pt: 'Verbos de Ação e Falha', en: 'Action & Failure Verbs' },
  { key: 'tradeoff', pt: 'Trade-offs', en: 'Trade-offs' },
  { key: 'modifiers', pt: 'Modificadores e Pegadinhas', en: 'Modifiers & Traps' },
]

export const DICTIONARY_TERMS: DictionaryTerm[] = [
  // ── Categoria 1 · Ecossistema ──────────────────────────────────────────────
  {
    term: 'Few-shot',
    pt: 'Exemplos no prompt (few-shot)',
    context:
      'Dar alguns exemplos no prompt para guiar o modelo. Pegadinha: "adicionar mais exemplos few-shot" costuma ser a alternativa ERRADA quando a questão pede uma solução estrutural/determinística (schema, enum, validação no backend).',
    category: 'ecosystem',
  },
  {
    term: 'Prompt Chaining',
    pt: 'Encadeamento de prompts',
    context:
      'Quebrar uma tarefa previsível em passos sequenciais isolados, mesclando no fim. É a resposta CERTA para fluxos fixos e multi-aspecto (ex.: revisar um PR por estilo, segurança e docs em passes separados) para evitar diluição de atenção.',
    category: 'ecosystem',
  },
  {
    term: 'Fallback',
    pt: 'Plano B / contingência',
    context:
      'Comportamento de reserva quando o caminho principal falha. Cuidado: uma instrução de fallback que faz o subagente desistir cedo (ex.: "reporte falha se houver menos de 5 resultados") pode ser a alternativa errada por reforçar rigidez.',
    category: 'ecosystem',
  },
  {
    term: 'Stop Reason',
    pt: 'Motivo de parada',
    context:
      'Campo da resposta da API que diz por que a geração parou (end_turn, max_tokens, tool_use, etc.). Ler o stop_reason orienta a orquestração e o tratamento de truncamento/continuação.',
    category: 'ecosystem',
  },
  {
    term: 'Tool Use',
    pt: 'Uso de ferramenta',
    context:
      'Quando o modelo invoca uma ferramenta/função externa. Base da arquitetura agêntica; o exame cobra design de tools (descrições, enums, IDs, limites) acima de instruções de prompt.',
    category: 'ecosystem',
  },
  {
    term: 'Hook',
    pt: 'Gancho (hook)',
    context:
      'Ponto de interceptação que dispara código automaticamente em um evento. No ecossistema Claude Code, hooks rodam comandos antes/depois de ações para impor comportamento de forma determinística.',
    category: 'ecosystem',
  },
  {
    term: 'Payload',
    pt: 'Carga útil (payload)',
    context:
      'O conteúdo de dados enviado/recebido numa requisição ou chamada de tool. O tamanho do payload (resultados de tool, contexto acumulado) afeta o limite de contexto, a latência e o custo.',
    category: 'ecosystem',
  },
  {
    term: 'Context Window',
    pt: 'Janela de contexto',
    context:
      'Limite total de tokens (entrada + saída) que o modelo processa. Cerne de várias questões: "lost in the middle", bloat de contexto, e schemas de tool grandes consumindo o orçamento e degradando a atenção no fim do documento.',
    category: 'ecosystem',
  },

  // ── Categoria 2 · Verbos de Ação e Falha ───────────────────────────────────
  {
    term: 'Trigger',
    pt: 'Disparar / acionar',
    context:
      'Causar a execução de algo (um hook, um fluxo, uma reanálise). "What triggers X" aparece em cenários de orquestração e de quando um conflito/aprovação deve ser acionado.',
    category: 'verbs',
  },
  {
    term: 'Bypass',
    pt: 'Contornar / burlar',
    context:
      'Pular uma regra ou checagem. Pegadinha clássica: uma regra de negócio que "não pode ser bypassed" precisa ser imposta na lógica do backend/tool — nunca via instrução de prompt, que é probabilística.',
    category: 'verbs',
  },
  {
    term: 'Enforce',
    pt: 'Impor / fazer cumprir',
    context:
      'Garantir uma regra de forma determinística. A resposta certa costuma ser "enforce dentro da lógica da tool" (ex.: limite de $500), não confiar no agente ou no prompt para respeitá-la.',
    category: 'verbs',
  },
  {
    term: 'Mock',
    pt: 'Simular (mock)',
    context:
      'Substituir um componente real por uma versão falsa/controlada para teste. Aparece em design e validação de sistemas, separando o comportamento testado das dependências externas.',
    category: 'verbs',
  },
  {
    term: 'Parse',
    pt: 'Analisar / interpretar (parsear)',
    context:
      'Extrair dados estruturados de um texto. O exame favorece saída JSON estruturada justamente para evitar "parsing" frágil de texto livre por regex/heurística em fluxos encadeados.',
    category: 'verbs',
  },
  {
    term: 'Fails silently',
    pt: 'Falha silenciosa',
    context:
      'Erro que não é reportado e passa despercebido. Pegadinha: truncar resultados "silently" (ex.: cortar para o top 5 sem avisar) esconde informação do agente — tende a ser a alternativa errada.',
    category: 'verbs',
  },

  // ── Categoria 3 · Trade-offs ────────────────────────────────────────────────
  {
    term: 'Overhead',
    pt: 'Sobrecarga / custo adicional',
    context:
      'Custo extra (latência, tokens, orquestração) de uma abordagem. Spawnar um subagente para reprocessar dados que o coordenador já tem em contexto adiciona overhead desnecessário — antipadrão.',
    category: 'tradeoff',
  },
  {
    term: 'Bottleneck',
    pt: 'Gargalo',
    context:
      'O ponto que limita o desempenho de todo o sistema. Em questões de latência, identificar o gargalo real (ex.: o spawn e a transferência de tokens, não o tamanho da janela) define a resposta.',
    category: 'tradeoff',
  },
  {
    term: 'Reliable',
    pt: 'Confiável',
    context:
      'Que produz um resultado consistente e previsível. O exame premia soluções "reliable"/determinísticas (enum, tool_choice, validação no backend) sobre abordagens probabilísticas baseadas em prompt.',
    category: 'tradeoff',
  },
  {
    term: 'Trade-off',
    pt: 'Compensação / contrapartida',
    context:
      'Troca entre dois objetivos (custo vs. SLA, completude vs. eficiência de contexto). Muitas questões pedem o melhor EQUILÍBRIO, não o extremo — leia se o critério é custo, latência ou robustez.',
    category: 'tradeoff',
  },
  {
    term: 'Workaround',
    pt: 'Solução paliativa / contorno',
    context:
      'Solução temporária que não corrige a causa raiz. Geralmente é a alternativa ERRADA quando existe uma correção estrutural disponível (ex.: cache como band-aid em vez de corrigir a delegação).',
    category: 'tradeoff',
  },

  // ── Categoria 4 · Modificadores e Pegadinhas ───────────────────────────────
  {
    term: 'Always',
    pt: 'Sempre',
    context:
      'Modificador absoluto. Em alternativas, "always" costuma sinalizar exagero — desconfie de regras categóricas, a menos que descrevam uma imposição determinística real no backend.',
    category: 'modifiers',
  },
  {
    term: 'Never',
    pt: 'Nunca',
    context:
      'Modificador absoluto. Idem ao "always": cuidado com afirmações categóricas. Há exceções legítimas no exame (ex.: "nunca confie em metadados auto-reportados de um servidor MCP não verificado").',
    category: 'modifiers',
  },
  {
    term: 'Only',
    pt: 'Apenas / somente',
    context:
      'Modificador restritivo. "Only" muda completamente o sentido de uma alternativa — leia com atenção exatamente o que está sendo limitado (ex.: aceitar "only the game_id" como entrada da tool).',
    category: 'modifiers',
  },
]
