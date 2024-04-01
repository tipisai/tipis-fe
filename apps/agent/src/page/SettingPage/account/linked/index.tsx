import { FC } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { MobileLinkedSetting } from "./mobile"
import { PCLinkedSetting } from "./pc"

const LinkedSetting: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t("profile.setting.oauth.title.oauth")}</title>
      </Helmet>
      <LayoutAutoChange
        desktopPage={<PCLinkedSetting />}
        mobilePage={<MobileLinkedSetting />}
      />
    </>
  )
}
export default LinkedSetting
