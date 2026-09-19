import { ActionType } from '@/shared/types/surveys/action.type'
import {
  ConditionOperator,
  type SimpleConditionOperatorType
} from '@/shared/types/surveys/condition.type'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { QuestionType } from '@/shared/types/surveys/nodes/question.node.type'
import { TriggerTiming } from '@/shared/types/surveys/trigger.type'
import { z } from 'zod'

/**
 * Schémas Zod de l'arbre d'un questionnaire.
 *
 * Ils décrivent la même structure que les discriminators Mongoose de
 * `src/server/models/nodes/`, mais côté contrat : ce sont eux qui valident le
 * corps du PUT de sauvegarde de l'éditeur.
 *
 * Volontairement **permissifs sur la complétude métier** : un brouillon en cours
 * d'édition contient des questions à choix sans options et des titres vides, et
 * doit pouvoir être sauvegardé. La complétude est une règle de publication.
 * Ce qui est vérifié ici, c'est la structure : `kind`, `type`, présence des
 * sous-objets et type des champs.
 */

/* ---------------------------------- CONDITIONS ---------------------------- */

const SimpleConditionOperator = z.enum([
  ConditionOperator.EQUALS,
  ConditionOperator.NOT_EQUALS,
  ConditionOperator.IN,
  ConditionOperator.INCLUDES,
  ConditionOperator.GREATER_THAN,
  ConditionOperator.GREATER_THAN_OR_EQUALS,
  ConditionOperator.LESS_THAN,
  ConditionOperator.LESS_THAN_OR_EQUALS
]) satisfies z.ZodType<SimpleConditionOperatorType>

const SimpleConditionSchema = z
  .object({
    op: SimpleConditionOperator,
    path: z.string().optional(),
    value: z.unknown()
  })
  // `z.unknown()` accepte la clé absente, alors que Mongoose l'exige : sans ce
  // contrôle, une condition à moitié saisie passe la validation puis fait
  // échouer la sauvegarde. `null`, lui, est une valeur de comparaison légitime.
  .refine(condition => 'value' in condition, {
    message: 'errors.common.required',
    path: ['value']
  })

const ExistsConditionSchema = z.object({
  op: z.literal(ConditionOperator.EXISTS),
  path: z.string()
})

export type ConditionInput =
  | z.infer<typeof SimpleConditionSchema>
  | z.infer<typeof ExistsConditionSchema>
  | {
      op: typeof ConditionOperator.AND | typeof ConditionOperator.OR
      conditions: ConditionInput[]
    }
  | { op: typeof ConditionOperator.NOT; condition: ConditionInput }

// `z.lazy` casse l'inférence sur un type récursif : le type est donc annoté
// explicitement via ConditionInput.
export const ConditionSchema: z.ZodType<ConditionInput> = z.lazy(() =>
  z.discriminatedUnion('op', [
    SimpleConditionSchema,
    ExistsConditionSchema,
    z.object({
      op: z.enum([ConditionOperator.AND, ConditionOperator.OR]),
      conditions: z.array(ConditionSchema)
    }),
    z.object({
      op: z.literal(ConditionOperator.NOT),
      condition: ConditionSchema
    })
  ])
)

/* ----------------------------------- ACTIONS ------------------------------ */

export const ActionSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal(ActionType.FLAG),
      path: z.string(),
      value: z.unknown()
    })
    .refine(action => 'value' in action, {
      message: 'errors.common.required',
      path: ['value']
    }),
  z.object({
    type: z.literal(ActionType.UNFLAG),
    path: z.string()
  }),
  z.object({
    type: z.literal(ActionType.GOTO),
    target: z.enum(['NEXT', 'PREVIOUS', 'END', 'NODE']),
    nodeId: z.string().optional()
  }),
  z.object({
    type: z.literal(ActionType.TOAST),
    level: z.enum(['info', 'success', 'warning', 'error']),
    message: z.string(),
    durationMs: z.number().optional()
  }),
  z.object({
    type: z.literal(ActionType.CONFIRM),
    title: z.string(),
    message: z.string(),
    onCancel: z.enum(['stop', 'noop'])
  })
])

/* ---------------------------------- TRIGGERS ------------------------------ */

export const TriggerRuleSchema = z.object({
  timing: z.enum([
    TriggerTiming.CHANGE,
    TriggerTiming.COMMIT,
    TriggerTiming.SUBMIT,
    TriggerTiming.ENTER,
    TriggerTiming.EXIT
  ]),
  when: ConditionSchema.optional(),
  actions: z.array(ActionSchema),
  dedupeKey: z.string().max(200, 'errors.common.max').optional()
})

/* ------------------------------ QUESTION CONFIGS -------------------------- */

const ChoiceOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional(),
  disabled: z.boolean().optional()
})

export const QuestionConfigSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(QuestionType.TEXT),
    placeholder: z.string().optional(),
    maxLength: z.number().optional(),
    minLength: z.number().optional(),
    pattern: z.string().optional(),
    commit: z.enum(['change', 'blur', 'next']).optional()
  }),
  z.object({
    type: z.literal(QuestionType.TEXTAREA),
    placeholder: z.string().optional(),
    maxLength: z.number().optional(),
    minLength: z.number().optional(),
    rows: z.number().optional(),
    commit: z.enum(['blur', 'next']).optional()
  }),
  z.object({
    type: z.literal(QuestionType.NUMBER),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    integer: z.boolean().optional(),
    unit: z.string().optional(),
    commit: z.enum(['change', 'blur', 'next']).optional()
  }),
  z.object({
    type: z.literal(QuestionType.DATE),
    min: z.string().optional(),
    max: z.string().optional(),
    commit: z.enum(['change', 'blur', 'next']).optional()
  }),
  z.object({
    type: z.literal(QuestionType.RADIO),
    options: z.array(ChoiceOptionSchema),
    layout: z.enum(['stack', 'grid']).optional(),
    commit: z.enum(['change', 'next']).optional()
  }),
  z.object({
    type: z.literal(QuestionType.CHECKBOXES),
    options: z.array(ChoiceOptionSchema),
    minChecked: z.number().optional(),
    maxChecked: z.number().optional(),
    layout: z.enum(['stack', 'grid']).optional(),
    commit: z.enum(['change', 'next']).optional()
  }),
  z.object({
    type: z.literal(QuestionType.SELECT),
    options: z.array(ChoiceOptionSchema),
    placeholder: z.string().optional(),
    searchable: z.boolean().optional(),
    commit: z.enum(['change', 'next']).optional()
  }),
  z.object({
    type: z.literal(QuestionType.SCALE),
    min: z.number(),
    max: z.number(),
    step: z.number().optional(),
    // `labels` est un Record<number, string> côté domaine, mais JSON n'a que des
    // clés string : c'est cette forme-là qui transite réellement.
    labels: z.record(z.string(), z.string()).optional(),
    commit: z.enum(['change', 'next']).optional()
  })
])

/* ------------------------------------ NODES ------------------------------- */

const BaseNodeFieldsSchema = z.object({
  id: z.string('errors.common.required').min(1, 'errors.common.required'),
  order: z.number(),
  title: z.string().max(200, 'errors.common.max').nullable(),
  subtitle: z.string().max(500, 'errors.common.max').nullable(),
  description: z.string().max(5000, 'errors.common.max').nullable(),
  code: z.string().max(200, 'errors.common.max').nullable(),
  condition: ConditionSchema.nullable(),
  triggers: z.array(TriggerRuleSchema)
})

const InfoNodeDetailsSchema = z.object({
  type: z.enum(['info', 'warning', 'error', 'success', 'neutral']),
  title: z.string().max(200, 'errors.common.max'),
  description: z.string().max(5000, 'errors.common.max')
})

const GroupNodeDetailsSchema = z.object({
  title: z.string().max(200, 'errors.common.max'),
  description: z.string().max(5000, 'errors.common.max')
})

/**
 * Un node non-page. `group` et `question` portent des enfants, eux-mêmes des
 * nodes non-page : c'est la récursivité de l'arbre, et la raison pour laquelle
 * `page` est exclu de cette union — seule la racine du questionnaire en porte.
 *
 * Ce type décrit ce qui **transite en JSON**, pas ce que le code manipule : les
 * ids y sont des `string` et non des `NodeId` brandés, et la cohérence entre
 * `type` et `config.type` d'une question est assurée au runtime par le `refine`
 * plutôt que par le typage. C'est le décalage contrat / domaine habituel du
 * projet, que le mapper comble.
 */
export type NodeInput =
  | ({ kind: typeof NodeKind.GROUP } & z.infer<typeof BaseNodeFieldsSchema> & {
        children: NodeInput[]
        group: z.infer<typeof GroupNodeDetailsSchema>
      })
  | ({ kind: typeof NodeKind.QUESTION } & z.infer<
      typeof BaseNodeFieldsSchema
    > & {
        type: QuestionType
        required?: boolean
        config: z.infer<typeof QuestionConfigSchema>
        children?: NodeInput[]
      })
  | ({ kind: typeof NodeKind.INFO } & z.infer<typeof BaseNodeFieldsSchema> & {
        info: z.infer<typeof InfoNodeDetailsSchema>
      })
  | ({ kind: typeof NodeKind.DIVIDER } & z.infer<typeof BaseNodeFieldsSchema>)

export const NodeSchema: z.ZodType<NodeInput> = z.lazy(() =>
  z.discriminatedUnion('kind', [
    BaseNodeFieldsSchema.extend({
      kind: z.literal(NodeKind.GROUP),
      children: z.array(NodeSchema),
      group: GroupNodeDetailsSchema
    }),
    BaseNodeFieldsSchema.extend({
      kind: z.literal(NodeKind.QUESTION),
      type: z.enum(QuestionType),
      required: z.boolean().optional(),
      config: QuestionConfigSchema,
      children: z.array(NodeSchema).optional()
    }).refine(node => node.type === node.config.type, {
      // Le node et sa config sont discriminés séparément : sans ce contrôle, on
      // peut persister une question `radio` portant une config `text`, que le
      // discriminator Mongoose accepterait sans broncher.
      message: 'errors.common.format',
      path: ['config', 'type']
    }),
    BaseNodeFieldsSchema.extend({
      kind: z.literal(NodeKind.INFO),
      info: InfoNodeDetailsSchema
    }),
    BaseNodeFieldsSchema.extend({
      kind: z.literal(NodeKind.DIVIDER)
    })
  ])
)

export const PageNodeSchema = BaseNodeFieldsSchema.extend({
  kind: z.literal(NodeKind.PAGE),
  children: z.array(NodeSchema),
  page: z.object({
    skippable: z.boolean()
  })
})

export type PageNodeInput = z.infer<typeof PageNodeSchema>
