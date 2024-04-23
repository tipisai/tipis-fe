import Icon from "@ant-design/icons"
import { Button } from "antd"
import { AnimatePresence } from "framer-motion"
import { FC, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { ContributeIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { openShareAgentModal } from "@illa-public/user-role-utils"
import ContributeTipisModal from "@/components/ContributeTipisModalContent/ContributeContent"
import ShareContentModal from "@/components/ContributeTipisModalContent/ShareContent"
import { IAgentForm } from "../../interface"
import { IContributeButtonProps } from "./interface"

const ContributeButton: FC<IContributeButtonProps> = ({ isMobile }) => {
  const { control, setValue } = useFormContext<IAgentForm>()
  const [aiAgentID, publishedToMarketplace, name] = useWatch({
    control: control,
    name: ["aiAgentID", "publishedToMarketplace", "name"],
  })

  const [contributeModalVisible, setContributeModalVisible] = useState(false)
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [successModalType, setSuccessModalType] = useState<
    "contribute" | "update"
  >()

  const handleUpdateCallback = (
    publishedToMarketplace: boolean,
    successModalType?: "contribute" | "update",
  ) => {
    setValue("publishedToMarketplace", publishedToMarketplace)
    setContributeModalVisible(false)
    if (publishedToMarketplace) {
      setShareModalVisible(true)
      setSuccessModalType(successModalType)
    }
  }

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const { t } = useTranslation()

  const onShowContributeDialog = () => {
    if (
      !openShareAgentModal(
        currentTeamInfo,
        currentTeamInfo.myRole,
        publishedToMarketplace,
      )
    ) {
      return
    }
    setContributeModalVisible(true)
  }
  return (
    <>
      {isMobile ? (
        <Icon component={ContributeIcon} onClick={onShowContributeDialog} />
      ) : (
        <Button
          size="large"
          disabled={!aiAgentID}
          icon={<Icon component={ContributeIcon} />}
          onClick={onShowContributeDialog}
        >
          {t("editor.ai-agent.contribute")}
        </Button>
      )}
      <AnimatePresence>
        {contributeModalVisible && (
          <ContributeTipisModal
            visible={contributeModalVisible}
            isContribute={publishedToMarketplace}
            tipisID={aiAgentID}
            contributeCallback={handleUpdateCallback}
            closeModal={() => setContributeModalVisible(false)}
          />
        )}
        {shareModalVisible && (
          <ShareContentModal
            visible={shareModalVisible}
            closeModal={() => setShareModalVisible(false)}
            shareTitle={`${t(
              "user_management.modal.social_media.default_text.agent",
              {
                tipisName: name,
              },
            )}`}
            tipiID={aiAgentID}
            tipisName={name}
            successModalType={successModalType}
          />
        )}
      </AnimatePresence>
    </>
  )
}

ContributeButton.displayName = "ContributeButton"

export default ContributeButton
