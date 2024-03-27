import { FC } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { track } from "@/utils/mixpanelHelper"
import { MobileLinkedSetting } from "./mobile"
import { PCLinkedSetting } from "./pc"

const LinkedSetting: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t("profile.setting.oauth.title.oauth")}</title>
      </Helmet>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.LINKED_SETTING}
      >
        <LayoutAutoChange
          desktopPage={<PCLinkedSetting />}
          mobilePage={<MobileLinkedSetting />}
        />
      </MixpanelTrackProvider>
    </>
  )
}
export default LinkedSetting
