import Icon from "@ant-design/icons"
import { FC, MouseEventHandler, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import OpenLinkIcon from "@/assets/setting/open-link.svg?react"
import { RedirectPortalModal } from "../RedirectPortolModal"
import { containerStyle, subMenuLabelStyle } from "./style"

export const GoToPortal: FC = () => {
  const { t } = useTranslation()
  const [portalModalVisible, setPortalModalVisible] = useState(false)

  const closePortalModal = useCallback(() => {
    setPortalModalVisible(false)
  }, [])

  const handleOnClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    setPortalModalVisible(true)
  }
  return (
    <div css={containerStyle}>
      <div css={subMenuLabelStyle} onClick={handleOnClick}>
        <span>{t("billing.menu.billing_portal")}</span>
        <Icon component={OpenLinkIcon} />
      </div>
      <RedirectPortalModal
        visible={portalModalVisible}
        onCancel={closePortalModal}
      />
    </div>
  )
}
