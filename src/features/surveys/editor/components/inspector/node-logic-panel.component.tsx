import type { Node } from '@/shared/types/surveys/nodes/node.type'

interface NodeLogicPanelProps {
  node: Node
}

export function NodeLogicPanel({ node }: NodeLogicPanelProps) {
  // Placeholder: la logique réelle (conditions / triggers) sera branchée ici.
  // On garde ce composant mince pour rester focalisé sur l'UI.
  if (!node) {
    return null
  }

  return <div>Logic</div>
}
