import { ReactNode } from "react"
import { TIntegrationType } from "@illa-public/public-types"

export interface LabelWithEditorProps {
  children: ReactNode
  label: string
}

export interface IEventEditorProps {
  integrationType: TIntegrationType
}
