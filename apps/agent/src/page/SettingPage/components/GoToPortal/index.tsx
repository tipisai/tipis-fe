import Icon from "@ant-design/icons"
import { App } from "antd"
import { FC, MouseEventHandler, useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { useLazyGetPortalURLQuery } from "@illa-public/user-data"
import OpenLinkIcon from "@/assets/setting/open-link.svg?react"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { PortalModalContent } from "./ProtolModalContent"
import { IModalInstance } from "./interface"
import { containerStyle, subMenuLabelStyle } from "./style"

export const GoToPortal: FC = () => {
  const { t } = useTranslation()
  const [triggerGetPortalURL] = useLazyGetPortalURLQuery()
  const modalInstance = useRef<IModalInstance | null>(null)

  const teamInfo = useGetCurrentTeamInfo()!
  const { message, modal } = App.useApp()

  const openPortalPage = useCallback(() => {
    triggerGetPortalURL({
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
  }, [message, t, teamInfo.id, triggerGetPortalURL])

  const closePortalModal = useCallback(() => {
    modalInstance.current?.destroy()
  }, [])

  const handleOnClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    modalInstance.current = modal.info({
      maskClosable: false,
      icon: null,
      footer: false,
      centered: true,
      content: <PortalModalContent closeModal={closePortalModal} />,
      width: "400px",
      styles: {
        content: {
          padding: 0,
        },
        body: {
          width: "100%",
        },
        mask: {
          backgroundColor: getColor("white", "05"),
          backdropFilter: "blur(5px)",
        },
      },
    })
    openPortalPage()
  }
  return (
    <div css={containerStyle}>
      <div css={subMenuLabelStyle} onClick={handleOnClick}>
        <span>{t("billing.menu.billing_portal")}</span>
        <Icon component={OpenLinkIcon} />
      </div>
    </div>
  )
}
