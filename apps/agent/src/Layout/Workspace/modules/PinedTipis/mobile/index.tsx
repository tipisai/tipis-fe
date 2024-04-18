import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { getPinedTipis } from "@/redux/ui/pinedTipis/selector"
import MobilePinedTipiTab from "../../../components/Tab/PinedTipiTab/mobile"
import { headerStyle, listContainerStyle, pinedTipisAreaStyle } from "./style"

const MobilePinedTipisArea = () => {
  const pinedTipis = useSelector(getPinedTipis)
  const { t } = useTranslation()

  return (
    <div css={pinedTipisAreaStyle}>
      <div css={headerStyle}>{t("dashboard.common.pin")}</div>
      <div css={listContainerStyle}>
        {pinedTipis.map((pinedTipi) => {
          return (
            <MobilePinedTipiTab
              tipiID={pinedTipi.tipiID}
              key={pinedTipi.tabID}
            />
          )
        })}
      </div>
    </div>
  )
}

MobilePinedTipisArea.displayName = "MobilePinedTipisArea"

export default MobilePinedTipisArea
