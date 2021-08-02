export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

export function pluralise(word: string, count: number) {
  const suffix = count !== 1 ? 's' : ''
  return `${word}${suffix}`
}
