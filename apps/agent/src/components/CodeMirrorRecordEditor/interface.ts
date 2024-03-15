import { Params } from "@illa-public/public-types"

export interface RecordEditorProps {
  label: string
  name?: string
  records: Params[] | null
  onAdd?: (name?: string) => void
  onDelete?: (index: number, record: Params, name?: string) => void
  onChangeKey?: (
    index: number,
    key: string,
    value: string,
    name?: string,
  ) => void
  onChangeValue?: (
    index: number,
    key: string,
    value: string,
    name?: string,
  ) => void
  completionOptions: Record<string, unknown>
  options?: {
    canAdd?: boolean
    canDelete?: boolean
    canEditKey?: boolean
    canEditValue?: boolean
  }
}
