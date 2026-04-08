// All user-facing UI strings (PT + EN). Questions/options are NEVER here — they stay English
// in the data. Use {param} placeholders; resolve via useTranslation's t(key, params).

export type Lang = 'pt' | 'en'

const pt = {
  'app.title': 'CCA-F Practice',

  'nav.home': 'Início',
  'nav.dictionary': 'Dicionário',

  'dict.title': 'Dicionário',
  'dict.subtitle':
    'Vocabulário técnico em inglês que cai na prova — busque por texto ou filtre por categoria.',
  'dict.search.placeholder': 'Buscar termo, tradução ou contexto…',
  'dict.search.clear': 'Limpar busca',
  'dict.filter.all': 'Todas',
  'dict.empty': 'Nenhum termo encontrado.',
  'dict.count': '{n} termos',

  'dict.tab.terms': 'Termos',
  'dict.tab.questions': 'Questões',
  'dict.q.search': 'Buscar nas questões…',
  'dict.q.count': '{n} questões',
  'dict.q.translate': 'Traduzir',
  'dict.q.hide': 'Ocultar tradução',
  'dict.q.translateAll': 'Traduzir todas',
  'dict.q.hideAll': 'Ocultar traduções',
  'dict.q.translationLabel': 'Tradução',
  'dict.q.correct': 'Correta',
  'dict.q.empty': 'Nenhuma questão encontrada.',
  'dict.q.allDomains': 'Todos',
  'dict.q.showAnswer': 'Mostrar resposta',
  'dict.q.hideAnswer': 'Ocultar resposta',
  'dict.q.answer': 'Resposta',

  'common.loading': 'Carregando questões…',
  'common.cancel': 'Cancelar',

  'home.stats.best': 'MELHOR NOTA',
  'home.stats.last': 'ÚLTIMA NOTA',
  'home.stats.exams': 'SIMULADOS FEITOS',
  'home.stats.meta':
    'Banco: {n} questões · nota na escala 100–1000 · corte 720 · pesos por domínio (não-oficiais)',

  'home.section.domains': 'TREINO POR DOMÍNIO',
  'home.section.exam': 'SIMULADO PONDERADO',
  'home.section.mixed': 'MODO MISTO',
  'home.section.history': 'HISTÓRICO POR DOMÍNIO',

  'domain.meta': '{n} questões · peso {w}%',

  'exam.quick.title': 'Rápido · 15',
  'exam.quick.sub': 'Amostra ponderada de 15 questões. ~10 min.',
  'exam.medium.title': 'Médio · 30',
  'exam.medium.sub': 'Amostra ponderada de 30 questões. ~20 min.',
  'exam.full.title': 'Completo · 60',
  'exam.full.sub': 'Simulado completo. Nota 100–1000. ~40 min.',
  'exam.full.badge': 'Simulado real',

  'mixed.title': 'Modo Misto',
  'mixed.sub': 'Todas as questões embaralhadas entre domínios',
  'mixed.start': 'Começar',

  'history.col.domain': 'Domínio',
  'history.col.attempts': 'Tentativas',
  'history.col.correct': 'Acertos',
  'history.col.rate': 'Taxa',
  'history.col.last': 'Última prática',
  'history.weakest': 'Domínio mais fraco',
  'history.empty': 'Pratique para ver suas estatísticas por domínio.',

  'resume.title': 'Sessão em andamento',
  'resume.sub': 'Você tem uma sessão não finalizada.',
  'resume.button': 'Retomar sessão',
  'resume.discard': 'Descartar',

  'modepicker.title': 'Como você quer praticar?',
  'modepicker.immediate.title': 'Ver resposta na hora',
  'modepicker.immediate.sub': 'Feedback e explicação a cada questão.',
  'modepicker.end.title': 'Ver tudo no final',
  'modepicker.end.sub': 'Sem interrupção. Revisão completa no resultado.',
  'modepicker.timer.title': 'Cronômetro por questão',
  'modepicker.timer.sub': 'Simula o tempo real da prova (120s por questão).',
  'modepicker.start': 'Começar',

  'quiz.exit': 'Sair',
  'quiz.counter': 'Questão {i}/{n}',
  'quiz.next': 'Próxima questão',
  'quiz.finish': 'Ver resultado',
  'quiz.confirm': 'Confirmar resposta',
  'quiz.timeup': 'Tempo esgotado',
  'quiz.exit.title': 'Sair da sessão?',
  'quiz.exit.desc': 'Seu progresso fica salvo e você pode retomar depois.',
  'quiz.exit.keep': 'Continuar',
  'quiz.exit.confirm': 'Sair',

  'explanation.label': 'Explicação',
  'explanation.autoclass': 'Domínio classificado automaticamente',

  'results.passed': 'APROVADO',
  'results.failed': 'REPROVADO',
  'results.cut': 'Corte: 720 · {correct}/{total} corretas',
  'results.scoreLabel': 'Nota (escala 100–1000, não-oficial)',
  'results.weakest': 'Domínio mais fraco',
  'results.breakdown': 'Desempenho por domínio',
  'results.review': 'Revisão das questões',
  'results.your': 'Sua',
  'results.correct': 'Correta',
  'results.time': 'Tempo',
  'results.cta.weakest': 'Treinar domínio mais fraco',
  'results.cta.newExam': 'Novo simulado',
  'results.cta.home': 'Home',

  'disclaimer.unofficial':
    'Domínios, pesos e escala de nota são consenso de comunidade — não publicados pela Anthropic.',
} satisfies Record<string, string>

export type TranslationKey = keyof typeof pt

const en: Record<TranslationKey, string> = {
  'app.title': 'CCA-F Practice',

  'nav.home': 'Home',
  'nav.dictionary': 'Dictionary',

  'dict.title': 'Dictionary',
  'dict.subtitle':
    'English technical vocabulary that shows up on the exam — search by text or filter by category.',
  'dict.search.placeholder': 'Search term, translation, or context…',
  'dict.search.clear': 'Clear search',
  'dict.filter.all': 'All',
  'dict.empty': 'No terms found.',
  'dict.count': '{n} terms',

  'dict.tab.terms': 'Terms',
  'dict.tab.questions': 'Questions',
  'dict.q.search': 'Search questions…',
  'dict.q.count': '{n} questions',
  'dict.q.translate': 'Translate',
  'dict.q.hide': 'Hide translation',
  'dict.q.translateAll': 'Translate all',
  'dict.q.hideAll': 'Hide translations',
  'dict.q.translationLabel': 'Translation',
  'dict.q.correct': 'Correct',
  'dict.q.empty': 'No questions found.',
  'dict.q.allDomains': 'All',
  'dict.q.showAnswer': 'Show answer',
  'dict.q.hideAnswer': 'Hide answer',
  'dict.q.answer': 'Answer',

  'common.loading': 'Loading questions…',
  'common.cancel': 'Cancel',

  'home.stats.best': 'BEST SCORE',
  'home.stats.last': 'LAST SCORE',
  'home.stats.exams': 'EXAMS DONE',
  'home.stats.meta':
    'Bank: {n} questions · score on the 100–1000 scale · cutoff 720 · per-domain weights (unofficial)',

  'home.section.domains': 'DOMAIN TRAINING',
  'home.section.exam': 'WEIGHTED EXAM',
  'home.section.mixed': 'MIXED MODE',
  'home.section.history': 'DOMAIN HISTORY',

  'domain.meta': '{n} questions · weight {w}%',

  'exam.quick.title': 'Quick · 15',
  'exam.quick.sub': 'Weighted sample of 15 questions. ~10 min.',
  'exam.medium.title': 'Medium · 30',
  'exam.medium.sub': 'Weighted sample of 30 questions. ~20 min.',
  'exam.full.title': 'Full · 60',
  'exam.full.sub': 'Full simulation. 100–1000 score. ~40 min.',
  'exam.full.badge': 'Real simulation',

  'mixed.title': 'Mixed Mode',
  'mixed.sub': 'All questions shuffled across domains',
  'mixed.start': 'Start',

  'history.col.domain': 'Domain',
  'history.col.attempts': 'Attempts',
  'history.col.correct': 'Correct',
  'history.col.rate': 'Rate',
  'history.col.last': 'Last practiced',
  'history.weakest': 'Weakest domain',
  'history.empty': 'Practice to see your per-domain stats.',

  'resume.title': 'Session in progress',
  'resume.sub': 'You have an unfinished session.',
  'resume.button': 'Resume session',
  'resume.discard': 'Discard',

  'modepicker.title': 'How do you want to practice?',
  'modepicker.immediate.title': 'See answer immediately',
  'modepicker.immediate.sub': 'Feedback and explanation after each question.',
  'modepicker.end.title': 'See everything at the end',
  'modepicker.end.sub': 'No interruptions. Full review at the results.',
  'modepicker.timer.title': 'Per-question timer',
  'modepicker.timer.sub': 'Simulates real exam timing (120s per question).',
  'modepicker.start': 'Start',

  'quiz.exit': 'Exit',
  'quiz.counter': 'Question {i}/{n}',
  'quiz.next': 'Next question',
  'quiz.finish': 'See results',
  'quiz.confirm': 'Confirm answer',
  'quiz.timeup': "Time's up",
  'quiz.exit.title': 'Exit session?',
  'quiz.exit.desc': 'Your progress is saved and you can resume later.',
  'quiz.exit.keep': 'Keep going',
  'quiz.exit.confirm': 'Exit',

  'explanation.label': 'Explanation',
  'explanation.autoclass': 'Domain auto-classified',

  'results.passed': 'PASSED',
  'results.failed': 'FAILED',
  'results.cut': 'Cutoff: 720 · {correct}/{total} correct',
  'results.scoreLabel': 'Score (100–1000 scale, unofficial)',
  'results.weakest': 'Weakest domain',
  'results.breakdown': 'Per-domain performance',
  'results.review': 'Question review',
  'results.your': 'Yours',
  'results.correct': 'Correct',
  'results.time': 'Time',
  'results.cta.weakest': 'Train weakest domain',
  'results.cta.newExam': 'New exam',
  'results.cta.home': 'Home',

  'disclaimer.unofficial':
    'Domains, weights, and score scale are community consensus — not published by Anthropic.',
}

export const translations: Record<Lang, Record<TranslationKey, string>> = { pt, en }
