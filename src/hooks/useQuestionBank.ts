import { useMemo } from 'react'

import { loadQuestionBank } from '@/data/questions'

export function useQuestionBank() {
  return useMemo(() => loadQuestionBank(), [])
}
