import { FC } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { track } from "@/utils/mixpanelHelper"
import { MobileLinkedSetting } from "./mobile"
import { PCLinkedSetting } from "./pc"

const LinkedSetting: FC = () => {
  return (
    <MixpanelTrackProvider
      basicTrack={track}
      pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.LINKED_SETTING}
    >
      <LayoutAutoChange
        desktopPage={<PCLinkedSetting />}
        mobilePage={<MobileLinkedSetting />}
      />
    </MixpanelTrackProvider>
  )
}
export default LinkedSetting
