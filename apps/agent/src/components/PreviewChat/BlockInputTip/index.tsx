import { memo } from "react"
import { useTranslation } from "react-i18next"
import AgentBlockInput from "@/assets/agent/agent-block-input.svg?react"
import { IBlockInputTipProps } from "./interface"
import { blockInputContainerStyle, blockInputTextStyle } from "./style"

const BlockInputTip = memo(({ editState }: IBlockInputTipProps) => {
  const { t } = useTranslation()
  return (
    <div css={blockInputContainerStyle}>
      <AgentBlockInput />
      <div css={blockInputTextStyle}>
        {editState === "RUN"
          ? t("editor.ai-agent.tips.not-start-run")
          : t("editor.ai-agent.tips.not-start")}
      </div>
    </div>
  )
})

BlockInputTip.displayName = "BlockInputTip"

export default BlockInputTip
