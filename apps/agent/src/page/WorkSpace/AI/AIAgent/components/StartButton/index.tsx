import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useMatch } from "react-router-dom"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { getCurrentId } from "@illa-public/user-data"
import store from "@/redux/store"
import {
  EDIT_TIPI_TEMPLATE_PATH,
  WORKSPACE_LAYOUT_PATH,
} from "@/router/constants"
import { removeChatMessageAndUIState } from "@/utils/localForage/uiState"
import { CREATE_TIPIS_ID } from "@/utils/recentTabs/constants"
import { AgentWSContext } from "../../../context/AgentWSContext"
import { IAgentForm, SCROLL_ID } from "../../interface"
import { handleScrollToElement } from "../../utils"
import { UploadContext } from "../UploadContext"
import { IStartButtonProps } from "./interface"

const StartButton: FC<IStartButtonProps> = (props) => {
  const { t } = useTranslation()

  const { isConnecting, isRunning, reconnect, connect } =
    useContext(AgentWSContext)

  const { clearErrors, getValues, setError } = useFormContext<IAgentForm>()
  const { uploadFileStore } = useContext(UploadContext)

  const editTipiPathMatch = useMatch(
    `${WORKSPACE_LAYOUT_PATH}/${EDIT_TIPI_TEMPLATE_PATH}`,
  )

  const handleVerifyOnStart = () => {
    clearErrors()
    if (!getValues("prompt")) {
      setError("prompt", {
        type: "required",
        message: t("editor.ai-agent.validation_blank.prompt"),
      })
      handleScrollToElement(SCROLL_ID.PROMPT)
      return false
    } else if (
      !getValues("variables").every(
        (param) =>
          (param.key === "" && param.value === "") ||
          (param.key !== "" && param.value !== ""),
      )
    ) {
      setError("variables", {
        type: "validate",
        message: t("editor.ai-agent.validation_blank.variable_value"),
      })
      handleScrollToElement(SCROLL_ID.VARIABLES)
      return false
    } else if (uploadFileStore.hasPendingFile()) {
      setError("knowledge", {
        type: "knowledge",
        message: t("dashboard.message.parsing_file_in_prog"),
      })
      handleScrollToElement(SCROLL_ID.KNOWLEDGE)
      return false
    }
    return true
  }

  const handleClickStart = async () => {
    TipisTrack.track("click_start", {
      parameter1: getValues("aiAgentID") ? "edit" : "create",
      parameter3: isRunning ? "restart" : "start",
    })
    if (!handleVerifyOnStart()) {
      return
    }
    if (isRunning) {
      const currentTeamID = getCurrentId(store.getState())!
      if (editTipiPathMatch) {
        await removeChatMessageAndUIState(
          currentTeamID,
          editTipiPathMatch.params.agentID!,
        )
      } else {
        await removeChatMessageAndUIState(currentTeamID, CREATE_TIPIS_ID)
      }
      await reconnect()
    } else {
      await connect()
    }
    props.onClickCallback?.()
  }
  return (
    <Button
      block
      size="large"
      type="default"
      loading={isConnecting}
      icon={
        isRunning ? (
          <Icon component={ResetIcon} />
        ) : (
          <Icon component={PlayFillIcon} />
        )
      }
      onClick={handleClickStart}
    >
      {!isRunning ? t("editor.ai-agent.start") : t("editor.ai-agent.restart")}
    </Button>
  )
}

export default StartButton
