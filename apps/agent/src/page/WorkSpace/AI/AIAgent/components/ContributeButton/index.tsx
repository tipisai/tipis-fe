import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { ContributeIcon } from "@illa-public/icon"
import { ShareAgentTab } from "@illa-public/invite-modal"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { openShareAgentModal } from "@illa-public/user-role-utils"
import ShareAndContributeModal from "../ShareAndContributeModal"

const ContributeButton: FC = () => {
  const { control } = useFormContext<Agent>()
  const [aiAgentID, publishedToMarketplace] = useWatch({
    control: control,
    name: ["aiAgentID", "publishedToMarketplace"],
  })

  const [shareDialogVisible, setShareDialogVisible] = useState(false)
  const [defaultShareTag, setDefaultShareTag] = useState<ShareAgentTab>(
    ShareAgentTab.SHARE_WITH_TEAM,
  )
  const [contributedDialogVisible, setContributedDialogVisible] =
    useState(false)
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const { t } = useTranslation()

  const onShowContributeDialog = () => {
    if (publishedToMarketplace) {
      setDefaultShareTag(ShareAgentTab.TO_MARKETPLACE)
      setShareDialogVisible(true)
    } else {
      if (
        !openShareAgentModal(
          currentTeamInfo,
          currentTeamInfo.myRole,
          publishedToMarketplace,
        )
      ) {
        // TODO: billing
        // upgradeModal({
        //   modalType: "upgrade",
        //   from: "agent_edit_contribute",
        // })
        return
      }
      setContributedDialogVisible(true)
    }
  }
  return (
    <>
      <Button
        size="large"
        disabled={!aiAgentID}
        icon={<Icon component={ContributeIcon} />}
        onClick={onShowContributeDialog}
      >
        {t("editor.ai-agent.contribute")}
      </Button>
      <ShareAndContributeModal
        shareDialogVisible={shareDialogVisible}
        contributedDialogVisible={contributedDialogVisible}
        defaultShareTag={defaultShareTag}
        setShareDialogVisible={setShareDialogVisible}
        setContributedDialogVisible={setContributedDialogVisible}
        setDefaultShareTag={setDefaultShareTag}
      />
    </>
  )
}

ContributeButton.displayName = "ContributeButton"

export default ContributeButton
