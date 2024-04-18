import { FC } from "react"
import { useSelector } from "react-redux"
import { getPinedTipis } from "@/redux/ui/pinedTipis/selector"
import PCPinedTipiTab from "../../../components/Tab/PinedTipiTab/pc"
import { useMonitorPinedTipiTabTabSort } from "../hook"
import { headerStyle, listContainerStyle, pinedTipisAreaStyle } from "./style"

const PinedTipisArea: FC = () => {
  const pinedTipis = useSelector(getPinedTipis)

  useMonitorPinedTipiTabTabSort()
  return (
    <div css={pinedTipisAreaStyle}>
      <div css={headerStyle}>Pin</div>
      <div css={listContainerStyle}>
        {pinedTipis.map((pinedTipi, i) => {
          return (
            <PCPinedTipiTab
              isMiniSize={false}
              tipiID={pinedTipi.tipiID}
              index={i}
              key={pinedTipi.tabID}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PinedTipisArea
