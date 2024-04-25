import { Tooltip } from "antd"
import { FC } from "react"
import RequireIcon from "@/assets/agent/require.svg?react"
import { ErrorText } from "../ErrorText"
import { ILayoutBlock } from "./interface"
import {
  agentBlockStyle,
  applyBlockSubtitleStyle,
  applyBlockTextStyle,
  blockTItleAndRequireContainerStyle,
  blockTitleContainer,
  childrenAndErrorMessageContainerStyle,
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
    isMobile = false,
    errorMessage,
    customRenderSubtitle,
  } = props

  return (
    <div css={agentBlockStyle(isMobile)} data-scroll-id={scrollId}>
      <div css={blockTitleContainer}>
        <div css={blockTItleAndRequireContainerStyle}>
          {title && (
            <Tooltip title={tips} trigger="hover" placement="top">
              <div css={applyBlockTextStyle(tips !== undefined)}>{title}</div>
            </Tooltip>
          )}
          {required && <RequireIcon />}
        </div>
        {customRenderSubtitle
          ? customRenderSubtitle
          : subtitle && (
              <Tooltip title={subtitleTips} trigger="hover">
                <div css={applyBlockSubtitleStyle(subtitleTips !== undefined)}>
                  {subtitle}
                </div>
              </Tooltip>
            )}
      </div>
      <div css={childrenAndErrorMessageContainerStyle}>
        {children}
        {errorMessage && <ErrorText errorMessage={errorMessage} />}
      </div>
    </div>
  )
}

export default LayoutBlock
LayoutBlock.displayName = "AIAgentBlock"
