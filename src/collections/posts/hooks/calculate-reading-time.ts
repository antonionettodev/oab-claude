import type { FieldHook } from 'payload'

const WORDS_PER_MINUTE = 200

function extractTextFromLexical(node: any): string {
  if (!node) return ''

  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexical).join(' ')
  }

  if (node.root && node.root.children) {
    return node.root.children.map(extractTextFromLexical).join(' ')
  }

  return ''
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

function calculateTime(wordCount: number): number {
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE)
  return Math.max(1, minutes)
}

export const calculateReadingTimeHook: FieldHook = ({ data, siblingData }) => {
  const content = data?.content || siblingData?.content

  if (!content) return 1

  const text = extractTextFromLexical(content)
  const wordCount = countWords(text)
  const readingTime = calculateTime(wordCount)

  return readingTime
}
