import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ShareIcon } from "@illa-public/icon"
import { ShareAgentTab } from "@illa-public/invite-modal"
import { Agent } from "@illa-public/public-types"
import ShareAndContributeModal from "../ShareAndContributeModal"

const ShareButton: FC = () => {
  const { control } = useFormContext<Agent>()
  const [aiAgentID] = useWatch({
    control: control,
    name: ["aiAgentID"],
  })
  const [shareDialogVisible, setShareDialogVisible] = useState(false)
  const [defaultShareTag, setDefaultShareTag] = useState<ShareAgentTab>(
    ShareAgentTab.SHARE_WITH_TEAM,
  )

  const { t } = useTranslation()

  const onShowShareDialog = () => {
    setDefaultShareTag(ShareAgentTab.SHARE_WITH_TEAM)
    setShareDialogVisible(true)
  }

  return (
    <>
      <Button
        size="large"
        disabled={!aiAgentID}
        icon={<Icon component={ShareIcon} />}
        onClick={onShowShareDialog}
      >
        {t("share")}
      </Button>
      <ShareAndContributeModal
        shareDialogVisible={shareDialogVisible}
        contributedDialogVisible={false}
        defaultShareTag={defaultShareTag}
        setShareDialogVisible={setShareDialogVisible}
        setContributedDialogVisible={() => {}}
        setDefaultShareTag={setDefaultShareTag}
      />
    </>
  )
}

ShareButton.displayName = "ShareButton"

export default ShareButton
