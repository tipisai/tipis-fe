import { forwardRef } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import PCPinedTipiTab from "@/Layout/Workspace/components/Tab/PinedTipiTab/pc"
import { getPinedTipis } from "@/redux/ui/pinedTipis/selector"
import { useMonitorPinedTipiTabTabSort } from "../hook"
import { IPinedTipiTabProps } from "./interface"
import { headerStyle, listContainerStyle, pinedTipisAreaStyle } from "./style"

const PinedTipisArea = forwardRef<HTMLDivElement, IPinedTipiTabProps>(
  (props, ref) => {
    const { height, isMiniSize } = props
    const pinedTipis = useSelector(getPinedTipis)
    const { t } = useTranslation()

    useMonitorPinedTipiTabTabSort()

    return (
      <div css={pinedTipisAreaStyle} className="pined-tipis-area">
        {!isMiniSize && (
          <div css={headerStyle}>{t("dashboard.common.pin")}</div>
        )}
        <div css={listContainerStyle(height)} ref={ref}>
          {pinedTipis.map((pinedTipi, i) => {
            return (
              <PCPinedTipiTab
                isMiniSize={isMiniSize}
                tipiID={pinedTipi.tipiID}
                index={i}
                key={pinedTipi.tabID}
              />
            )
          })}
        </div>
      </div>
    )
  },
)

PinedTipisArea.displayName = "PinedTipisArea"

export default PinedTipisArea
