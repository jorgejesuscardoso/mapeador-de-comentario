export function formatRankingPosition(pos: number | string) {
  const position = Number(pos)

  switch (position) {
    case 1:
      return '🥇 1st'
    case 2:
      return '🥈 2nd'
    case 3:
      return '🥉 3rd'
    default:
      return `${position}${getOrdinal(position)}`
  }
}

export function getOrdinal(n: number) {
  if (n >= 11 && n <= 13) return 'th'
  const lastDigit = n % 10
  switch (lastDigit) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}