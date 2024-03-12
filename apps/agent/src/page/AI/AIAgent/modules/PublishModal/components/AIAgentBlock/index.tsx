import { Tooltip } from "antd"
import { FC } from "react"
import RequireIcon from "@/assets/agent/require.svg?react"
import { IModalEditorBlockProps } from "./interface"
import {
  agentBlockStyle,
  applyBlockSubtitleStyle,
  applyBlockTextStyle,
  blockRequireStyle,
  blockTitleContainer,
} from "./style"

export const ModalEditorBlock: FC<IModalEditorBlockProps> = (props) => {
  const { title, tips, children, subtitle, subtitleTips, required } = props

  return (
    <div css={agentBlockStyle}>
      <div css={blockTitleContainer}>
        {title && (
          <Tooltip title={tips} trigger="hover" placement="top">
            <div css={applyBlockTextStyle(tips !== undefined)}>{title}</div>
          </Tooltip>
        )}
        {required && <RequireIcon css={blockRequireStyle} />}
        <div style={{ flex: 1 }} />
        {subtitle && (
          <Tooltip title={subtitleTips} trigger="hover">
            <div css={applyBlockSubtitleStyle(subtitleTips !== undefined)}>
              {subtitle}
            </div>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  )
}

export default ModalEditorBlock
ModalEditorBlock.displayName = "AIAgentBlock"
