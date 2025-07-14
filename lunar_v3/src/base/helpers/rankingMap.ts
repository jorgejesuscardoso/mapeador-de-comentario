import { capitalize } from './capitalize'

export function getRankingDisplay(ranking: string | null): { label: string; class: string } | null {
  if (!ranking) return null

  const capitalized = capitalize(ranking)

  return {
    label: capitalized,
    class: 'bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-1 text-[10px] rounded font-bold'
  }
}
