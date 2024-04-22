import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { ContributeIcon } from "@illa-public/icon"
import {
  ContributeAgentPC,
  HASHTAG_REQUEST_TYPE,
} from "@illa-public/invite-modal"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { openShareAgentModal } from "@illa-public/user-role-utils"
import { IAgentForm } from "../../interface"

const ContributeButton: FC = () => {
  const { control } = useFormContext<IAgentForm>()
  const [aiAgentID, publishedToMarketplace] = useWatch({
    control: control,
    name: ["aiAgentID", "publishedToMarketplace"],
  })

  const [_shareDialogVisible, setShareDialogVisible] = useState(false)
  // const [_defaultShareTag, setDefaultShareTag] = useState<ShareAgentTab>(
  //   ShareAgentTab.SHARE_WITH_TEAM,
  // )
  const [contributedDialogVisible, setContributedDialogVisible] =
    useState(false)
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const { t } = useTranslation()

  const onShowContributeDialog = () => {
    if (publishedToMarketplace) {
      // setDefaultShareTag(ShareAgentTab.TO_MARKETPLACE)
      setShareDialogVisible(true)
    } else {
      if (
        !openShareAgentModal(
          currentTeamInfo,
          currentTeamInfo.myRole,
          publishedToMarketplace,
        )
      ) {
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
      <Controller
        name="publishedToMarketplace"
        control={control}
        render={({ field }) => (
          <>
            {contributedDialogVisible && (
              <ContributeAgentPC
                onContributed={(isAgentContributed) => {
                  field.onChange(isAgentContributed)
                  // if (isAgentContributed) {
                  //   const newUrl = new URL(getAgentPublicLink(idField.value))
                  //   newUrl.searchParams.set("token", getAuthToken())
                  //   window.open(newUrl, "_blank")
                  // }
                }}
                teamID={currentTeamInfo.id}
                onClose={() => {
                  setContributedDialogVisible(false)
                }}
                productID={aiAgentID}
                productType={HASHTAG_REQUEST_TYPE.UNIT_TYPE_AI_AGENT}
                productContributed={field.value}
              />
            )}
          </>
        )}
      />
    </>
  )
}

ContributeButton.displayName = "ContributeButton"

export default ContributeButton
