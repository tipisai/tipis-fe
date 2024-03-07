import { Tooltip } from "antd"
import { FC } from "react"
import RequireIcon from "@/assets/agent/require.svg?react"
import { AIAgentBlockProps } from "./interface"
import {
  agentBlockStyle,
  applyBlockSubtitleStyle,
  applyBlockTextStyle,
  blockRequireStyle,
  blockTitleContainer,
} from "./style"

export const AIAgentBlock: FC<AIAgentBlockProps> = (props) => {
  const { title, tips, children, subtitle, subtitleTips, required, scrollId } =
    props

  return (
    <div css={agentBlockStyle} data-scroll-id={scrollId}>
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

export default AIAgentBlock
AIAgentBlock.displayName = "AIAgentBlock"
