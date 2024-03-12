import { ReactNode } from "react"

export interface IWorkspaceHeaderLayoutProps {
  title: string
  titleDesc?: string
  customRenderTitle?: (title: string, titleDesc?: string) => ReactNode
  extra?: ReactNode
}
