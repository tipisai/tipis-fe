import { memo, useContext, useMemo } from "react"
import { useTranslation } from "react-i18next"
import AgentBlockInputIcon from "@/assets/agent/agent-block-input.svg?react"
import { PreviewChatUseContext } from "../../PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "../../PreviewChatUseContext/constants"
import { blockInputContainerStyle, blockInputTextStyle } from "./style"

const BlockInputTip = memo(() => {
  const { t } = useTranslation()

  const { useTo } = useContext(PreviewChatUseContext)

  const tips = useMemo(() => {
    switch (useTo) {
      case PREVIEW_CHAT_USE_TO.EDIT_TIPI:
      case PREVIEW_CHAT_USE_TO.CREATE_TIPI:
        return t("editor.ai-agent.tips.not-start")
      case PREVIEW_CHAT_USE_TO.RUN:
      case PREVIEW_CHAT_USE_TO.DEFAULT_CHAT:
        return t("editor.ai-agent.tips.not-start-run")
    }
  }, [t, useTo])

  return (
    <div css={blockInputContainerStyle}>
      <AgentBlockInputIcon />
      <div css={blockInputTextStyle}>{tips}</div>
    </div>
  )
})

BlockInputTip.displayName = "BlockInputTip"

export default BlockInputTip
