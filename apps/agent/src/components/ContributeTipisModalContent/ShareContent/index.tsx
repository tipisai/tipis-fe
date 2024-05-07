import Icon from "@ant-design/icons"
import { App, Button, Input, Modal } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { openLinkOnNewTab } from "@illa-public/cross-platform-utils"
import { CopyIcon } from "@illa-public/icon"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { ShareBlockMobile, ShareBlockPC } from "@illa-public/market-share"
import {
  COPY_STATUS,
  copyToClipboard,
  getAgentPublicLink,
} from "@illa-public/utils"
import OpenWindowIcon from "@/assets/agent/open-window.svg?react"
import {
  inputContainerStyle,
  linkContainer,
  linkTitleStyle,
  shareContainerStyle,
} from "./style"

interface IShareContentProps {
  shareTitle: string
  tipiID: string
  closeModal: () => void
  tipisName: string
  visible: boolean
  successModalType?: "contribute" | "update"
}

const ShareContentModal: FC<IShareContentProps> = ({
  shareTitle,
  tipiID,
  tipisName,
  visible,
  closeModal,
  successModalType,
}) => {
  const { t } = useTranslation()
  const link = getAgentPublicLink(tipiID)
  const { message } = App.useApp()

  const handleCopyMarketplaceLink = () => {
    const flag = copyToClipboard(
      t("user_management.modal.contribute.default_text.agent", {
        tipisName,
        tipisLink: link,
      }),
    )
    if (flag === COPY_STATUS.EMPTY) {
      message.info({
        content: t("empty_copied_tips"),
      })
      message.info(t("empty_copied_tips"))
    } else {
      message.success(t("copied"))
    }
  }

  const handleOpenLink = () => {
    openLinkOnNewTab(link)
  }

  return (
    <Modal
      title={
        successModalType === "contribute"
          ? t("homepage.contribute_modal.successful.successfully_contributed")
          : t("homepage.contribute_modal.successful.successfully_updated")
      }
      footer={null}
      closable
      open={visible}
      onCancel={closeModal}
      destroyOnClose
      width="520px"
      style={{
        padding: 0,
      }}
    >
      <div css={shareContainerStyle}>
        <div css={linkContainer}>
          <span css={linkTitleStyle}>
            {t("homepage.contribute_modal.successful.link")}
          </span>
          <div css={inputContainerStyle}>
            <Input
              value={link}
              readOnly
              width="100%"
              suffix={
                <Icon component={OpenWindowIcon} onClick={handleOpenLink} />
              }
            />
            <Button
              icon={<Icon component={CopyIcon} />}
              onClick={handleCopyMarketplaceLink}
            >
              {t("homepage.contribute_modal.successful.copy")}
            </Button>
          </div>
        </div>
        <LayoutAutoChange
          desktopPage={
            <ShareBlockPC
              title={shareTitle}
              shareUrl={getAgentPublicLink(tipiID)}
            />
          }
          mobilePage={
            <ShareBlockMobile
              title={shareTitle}
              shareUrl={getAgentPublicLink(tipiID)}
            />
          }
        />
      </div>
    </Modal>
  )
}

export default ShareContentModal
