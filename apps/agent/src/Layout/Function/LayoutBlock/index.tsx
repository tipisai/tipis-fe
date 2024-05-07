import { Tooltip } from "antd"
import { FC } from "react"
import RequireIcon from "@/assets/agent/require.svg?react"
import { ILayoutBlock } from "./interface"
import {
  agentBlockStyle,
  applyBlockSubtitleStyle,
  applyBlockTextStyle,
  blockTItleAndRequireContainerStyle,
  blockTitleContainer,
  childrenAndErrorMessageContainerStyle,
  descriptionStyle,
  titleAndDescriptionContainerStyle,
} from "./style"

export const LayoutBlock: FC<ILayoutBlock> = (props) => {
  const {
    title,
    description,
    tips,
    children,
    subtitle,
    subtitleTips,
    required,
    isMobile = false,
  } = props

  return (
    <div css={agentBlockStyle(isMobile)}>
      <div css={titleAndDescriptionContainerStyle}>
        <div css={blockTitleContainer}>
          <div css={blockTItleAndRequireContainerStyle}>
            {title && (
              <Tooltip title={tips} trigger="hover" placement="top">
                <div css={applyBlockTextStyle(tips !== undefined)}>{title}</div>
              </Tooltip>
            )}
            {required && <RequireIcon />}
          </div>
          {subtitle && (
            <Tooltip title={subtitleTips} trigger="hover">
              <div css={applyBlockSubtitleStyle(subtitleTips !== undefined)}>
                {subtitle}
              </div>
            </Tooltip>
          )}
        </div>
        {description && <div css={descriptionStyle}>{description}</div>}
      </div>
      <div css={childrenAndErrorMessageContainerStyle}>{children}</div>
    </div>
  )
}

export default LayoutBlock
LayoutBlock.displayName = "AIAgentBlock"
