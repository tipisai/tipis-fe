import Icon from "@ant-design/icons"
import { App, Modal } from "antd"
import { FC, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { getColor } from "@illa-public/color-scheme"
import { CloseIcon } from "@illa-public/icon"
import {
  getCurrentTeamInfo,
  useLazyGetPortalURLQuery,
} from "@illa-public/user-data"
import LinkedIcon from "./assets/linked.svg?react"
import {
  contentStyle,
  imgStyle,
  labelStyle,
  modalCloseIconStyle,
} from "./style"

interface RedirectPortalModalProps {
  visible: boolean
  onCancel: () => void
}

export const RedirectPortalModal: FC<RedirectPortalModalProps> = (props) => {
  const { visible, onCancel } = props
  const { t } = useTranslation()
  const { message } = App.useApp()
  const teamInfo = useSelector(getCurrentTeamInfo)!
  const [triggetGetPortalURL] = useLazyGetPortalURLQuery()

  const openPortalPage = useCallback(() => {
    triggetGetPortalURL({
      teamID: teamInfo.id,
      returningURL: window.location.href,
    })
      .unwrap()
      .then((data) => {
        window.location.href = data.url
      })
      .catch((err) => {
        console.log(err)
        message.error(t("network.error"))
      })
  }, [message, t, teamInfo.id, triggetGetPortalURL])

  return (
    <Modal
      maskClosable={false}
      footer={false}
      open={visible}
      afterOpenChange={(visible) => {
        visible && openPortalPage()
      }}
      onCancel={onCancel}
      closeIcon={false}
      width="400px"
      centered
      styles={{
        content: {
          padding: "64px 20px 40px 20px",
        },
        mask: {
          backgroundColor: getColor("white", "05"),
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <div css={modalCloseIconStyle} onClick={onCancel}>
        <Icon component={CloseIcon} />
      </div>
      <div css={contentStyle}>
        <LinkedIcon css={imgStyle} />
        <div css={labelStyle}>{t("billing.redirect_to_stripe")}</div>
      </div>
    </Modal>
  )
}

RedirectPortalModal.displayName = "RedirectPortalModal"
