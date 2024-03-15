import { Tooltip } from "antd"
import { FC } from "react"
import RequireIcon from "@/assets/agent/require.svg?react"
import { ILayoutBlock } from "./interface"
import {
  agentBlockStyle,
  applyBlockSubtitleStyle,
  applyBlockTextStyle,
  blockRequireStyle,
  blockTitleContainer,
} from "./style"

export const LayoutBlock: FC<ILayoutBlock> = (props) => {
  const {
    title,
    tips,
    children,
    subtitle,
    subtitleTips,
    required,
    scrollId,
    mode = "panel",
  } = props

  return (
    <div css={agentBlockStyle(mode)} data-scroll-id={scrollId}>
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

export default LayoutBlock
LayoutBlock.displayName = "AIAgentBlock"
