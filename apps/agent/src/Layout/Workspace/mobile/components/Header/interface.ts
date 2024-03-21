import { IconComponentProps } from "@ant-design/icons/lib/components/Icon"
import { ReactNode } from "react"

export interface IWorkspaceHeaderLayoutProps {
  title: string
  titleDesc?: string
  extra?: ReactNode
  closeIcon?: IconComponentProps["component"]
  onClickClose?: () => void
  customRenderTitle?: (title: string) => ReactNode
}
