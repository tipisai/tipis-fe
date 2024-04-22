import { FC } from "react"
import { useTranslation } from "react-i18next"

export const HashTag: FC = () => {
  const { t } = useTranslation()

  return (
    <div>
      {t("homepage.contribute_modal.tag")}
      {t("homepage.contribute_modal.enter_confirm_tag")}
      {t("homepage.contribute_modal.recommended_tag")}
      {t("homepage.contribute_modal.cancel")}
      {t("homepage.contribute_modal.update")}
      {t("homepage.contribute_modal.successful.contribute")}
      {t("homepage.contribute_modal.successful.successfully_contributed")}
      {t("homepage.contribute_modal.successful.successfully_updated")}
      {t("homepage.contribute_modal.successful.link")}
      {t("homepage.contribute_modal.successful.copy")}
      {t("homepage.contribute_modal.successful.share_on")}
    </div>
  )
}
