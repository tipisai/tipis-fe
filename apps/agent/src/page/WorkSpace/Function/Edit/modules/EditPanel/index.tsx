import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import EditPanelLayout from "@/Layout/EditPanelLayout"
import AvatarUploader from "./components/AvatarUploader"
import DescriptionEditor from "./components/DescriptionEditor"
import NameEditor from "./components/NameEditor"
import ParametersEditor from "./components/ParametersEditor"

const EditPanel: FC = () => {
  const { t } = useTranslation()

  // const { isConnecting, isRunning, reconnect, connect } =
  //   useContext(AgentWSContext)

  // const { clearErrors, getValues, setError } = useFormContext<Agent>()
  // const currentTeamInfo = useSelector(getCurrentTeamInfo)!!

  // const upgradeModal = useUpgradeModal()

  // const canUseBillingFeature = canUseUpgradeFeature(
  //   currentTeamInfo?.myRole,
  //   getPlanUtils(currentTeamInfo),
  //   currentTeamInfo?.totalTeamLicense?.teamLicensePurchased,
  //   currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  // )

  // const handleVerifyOnStart = () => {
  //   clearErrors()
  //   if (!getValues("prompt")) {
  //     setError("prompt", {
  //       type: "required",
  //       message: t("editor.ai-agent.validation_blank.prompt"),
  //     })
  //     handleScrollToElement(SCROLL_ID.PROMPT)
  //     return false
  //   } else if (
  //     !getValues("variables").every(
  //       (param) =>
  //         (param.key === "" && param.value === "") ||
  //         (param.key !== "" && param.value !== ""),
  //     )
  //   ) {
  //     setError("variables", {
  //       type: "validate",
  //       message: t("editor.ai-agent.validation_blank.variable_value"),
  //     })
  //     handleScrollToElement(SCROLL_ID.VARIABLES)
  //     return false
  //   } else if (
  //     Array.isArray(getValues("knowledge")) &&
  //     getValues("knowledge").length > 0 &&
  //     getValues("knowledge").some((param) => param.value === "")
  //   ) {
  //     setError("variables", {
  //       type: "knowledge",
  //       message: t("dashboard.message.parsing_file_in_prog"),
  //     })
  //     handleScrollToElement(SCROLL_ID.KNOWLEDGE)
  //     return false
  //   }
  //   return true
  // }

  // const handleClickStart = async () => {
  //   if (!handleVerifyOnStart()) {
  //     return
  //   }
  //   if (isPremiumModel(getValues("model")) && !canUseBillingFeature) {
  //     upgradeModal({
  //       modalType: "agent",
  //       from: "agent_run_gpt4",
  //     })
  //     return
  //   }
  //   track(
  //     ILLA_MIXPANEL_EVENT_TYPE.CLICK,
  //     ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
  //     {
  //       element: isRunning ? "restart" : "start",
  //       parameter1: agentData2JSONReport(getValues()),
  //       parameter5: getValues("aiAgentID") || "-1",
  //     },
  //   )
  //   isRunning ? await reconnect() : await connect()
  // }

  return (
    <EditPanelLayout
      customWidth="900px"
      footerChildren={
        <Button
          block
          size="large"
          type="default"
          // loading={isConnecting}
          // icon={
          //   isRunning ? (
          //     <Icon component={ResetIcon} />
          //   ) : (
          //     <Icon component={PlayFillIcon} />
          //   )
          // }
          // onClick={handleClickStart}
        >
          {/* {!isRunning
            ? t("editor.ai-agent.start")
            : t("editor.ai-agent.restart")} */}
          {t("editor.ai-agent.start")}
        </Button>
      }
    >
      <AvatarUploader />
      <NameEditor />
      <DescriptionEditor />
      <ParametersEditor />
    </EditPanelLayout>
  )
}

export default EditPanel
