import { isEqual } from "lodash-es"
import { FC, memo, useContext, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { track } from "../../../../../../utils/mixpanelHelper"
import { PreviewChat } from "../../../components/PreviewChat"
import { AgentWSContext } from "../../../context/AgentWSContext"
import { rightPanelContainerStyle } from "./style"

const PreviewChatHistory: FC = memo(() => {
  const { getValues, control } = useFormContext<Agent>()
  const { isRunning, lastRunAgent } = useContext(AgentWSContext)

  const [agentType] = useWatch({
    control: control,
    name: ["agentType"],
  })

  const fieldArray = useWatch({
    control: control,
    name: ["variables", "model", "prompt", "agentType"],
  })

  const blockInputDirty = useMemo(() => {
    if (lastRunAgent === undefined) {
      return true
    }
    return (
      !isEqual(
        lastRunAgent.variables.filter((v) => v.key !== "" && v.value !== ""),
        fieldArray[0].filter((v) => v.key !== "" && v.value !== ""),
      ) ||
      !isEqual(lastRunAgent.model, fieldArray[1]) ||
      !isEqual(lastRunAgent.prompt, fieldArray[2]) ||
      !isEqual(lastRunAgent.agentType, fieldArray[3])
    )
  }, [lastRunAgent, fieldArray])

  return (
    <div css={rightPanelContainerStyle}>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT}
      >
        <PreviewChat
          isMobile={false}
          model={getValues("model")}
          editState="EDIT"
          agentType={agentType}
          blockInput={!isRunning || blockInputDirty}
        />
      </MixpanelTrackProvider>
    </div>
  )
})

PreviewChatHistory.displayName = "PreviewChat"

export default PreviewChatHistory
