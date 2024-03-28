import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { CloseIcon } from "@illa-public/icon"
import LinkedIcon from "@/assets/setting/stripe-linked.svg?react"
import { IPortolModalContentProps } from "./interface"
import {
  contentContainerStyle,
  contentStyle,
  imgStyle,
  labelStyle,
  modalCloseIconStyle,
} from "./style"

export const PortalModalContent: FC<IPortolModalContentProps> = ({
  closeModal,
}) => {
  const { t } = useTranslation()

  return (
    <div css={contentContainerStyle}>
      <div css={modalCloseIconStyle} onClick={closeModal}>
        <Icon component={CloseIcon} />
      </div>
      <div css={contentStyle}>
        <LinkedIcon css={imgStyle} />
        <div css={labelStyle}>{t("billing.redirect_to_stripe")}</div>
      </div>
    </div>
  )
}
