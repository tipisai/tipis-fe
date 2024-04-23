import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { FC, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { ContributeIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { openShareAgentModal } from "@illa-public/user-role-utils"
import ContributeTipisModalContent from "@/components/ContributeTipisModalContent/ContributeContent"
import ShareContent from "@/components/ContributeTipisModalContent/ShareContent"
import { IAgentForm } from "../../interface"
import { IModalInstance } from "./interface"
import { modalStyle } from "./style"

const ContributeButton: FC = () => {
  const { control, setValue } = useFormContext<IAgentForm>()
  const [aiAgentID, publishedToMarketplace, name] = useWatch({
    control: control,
    name: ["aiAgentID", "publishedToMarketplace", "name"],
  })
  const { modal } = App.useApp()
  const modalInstance = useRef<IModalInstance | null>(null)

  const closeModal = () => {
    modalInstance.current?.destroy()
  }

  const handleUpdateCallback = (
    publishedToMarketplace: boolean,
    successModalType?: "contribute" | "update",
  ) => {
    setValue("publishedToMarketplace", publishedToMarketplace)
    if (publishedToMarketplace) {
      const title =
        successModalType === "contribute"
          ? t("homepage.contribute_modal.successful.successfully_contributed")
          : t("homepage.contribute_modal.successful.successfully_updated")

      modalInstance.current?.update({
        title,
        content: (
          <ShareContent
            shareTitle={`${t(
              "user_management.modal.social_media.default_text.agent",
              {
                tipisName: name,
              },
            )}`}
            tipiID={aiAgentID}
            tipisName={name}
          />
        ),
      })
    } else {
      closeModal()
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
    modalInstance.current = modal.info({
      title: t("homepage.contribute_modal.contribute"),
      content: (
        <ContributeTipisModalContent
          isContribute={publishedToMarketplace}
          tipisID={aiAgentID}
          contributeCallback={handleUpdateCallback}
        />
      ),
      width: "520px",
      footer: null,
      icon: null,
      closable: true,
      onCancel: closeModal,
      modalRender(node) {
        return <div css={modalStyle}>{node}</div>
      },
    })
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
    </>
  )
}

ContributeButton.displayName = "ContributeButton"

export default ContributeButton
