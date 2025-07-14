import { ROLE_MAP } from './roleMap'
import { capitalize } from './capitalize'

interface RoleDisplayResult {
  label: string
  class: string
}

export function getRoleDisplay(role: string, subrole?: string): RoleDisplayResult {
  const base = ROLE_MAP[role] || {
    label: 'Membro',
    class: 'bg-blue-500'
  }
  // Se tiver subrole, capitaliza e concatena
  const finalLabel = subrole ? `${base.label} ${capitalize(subrole)}` : base.label

  return {
    label: finalLabel,
    class: base.class
  }
}
