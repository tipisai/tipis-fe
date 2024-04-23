import Icon from "@ant-design/icons"
import { App, Button, Input } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { CopyIcon } from "@illa-public/icon"
import { ShareBlockPC } from "@illa-public/market-share"
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
  tipisName: string
}

const ShareContent: FC<IShareContentProps> = ({
  shareTitle,
  tipiID,
  tipisName,
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
  return (
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
            suffix={<Icon component={OpenWindowIcon} />}
          />
          <Button
            icon={<Icon component={CopyIcon} />}
            onClick={handleCopyMarketplaceLink}
          >
            {t("homepage.contribute_modal.successful.copy")}
          </Button>
        </div>
      </div>
      <ShareBlockPC title={shareTitle} shareUrl={getAgentPublicLink(tipiID)} />
    </div>
  )
}

export default ShareContent
