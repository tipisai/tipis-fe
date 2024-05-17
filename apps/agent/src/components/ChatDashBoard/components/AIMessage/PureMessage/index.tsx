import Icon from "@ant-design/icons"
import { App, Tooltip } from "antd"
import { FC, useRef } from "react"
import { useTranslation } from "react-i18next"
import { CopyIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import MarkdownMessage from "../../MarkdownMessage"
import { IPureMessageProps } from "./interface"
import { markdownHoverCopyStyle, pureMessageContainerStyle } from "./style"

export const PureMessage: FC<IPureMessageProps> = ({ content, isMobile }) => {
  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const contentBody = (
    <div css={pureMessageContainerStyle} ref={containerRef}>
      <MarkdownMessage>{content}</MarkdownMessage>
    </div>
  )

  if (!content) return null
  return isMobile ? (
    contentBody
  ) : (
    <Tooltip
      color="transparent"
      zIndex={0}
      overlayInnerStyle={{
        padding: 0,
        minHeight: "24px",
        minWidth: "24px",
        boxShadow: "none",
      }}
      mouseEnterDelay={0}
      mouseLeaveDelay={0.5}
      title={
        <span
          css={markdownHoverCopyStyle}
          onClick={() => {
            copyToClipboard(content ?? "")
            messageAPI.success({
              content: t("copied"),
            })
          }}
        >
          <Icon component={CopyIcon} />
        </span>
      }
      placement="rightBottom"
      showArrow={false}
      autoAdjustOverflow={false}
      trigger="hover"
      getTooltipContainer={() => containerRef.current!}
    >
      {contentBody}
    </Tooltip>
  )
}
