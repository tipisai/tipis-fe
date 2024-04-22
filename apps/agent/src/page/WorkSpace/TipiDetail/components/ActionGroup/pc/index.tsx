import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import {
  ForkIcon,
  PinIcon,
  PlayFillIcon,
  ShareIcon,
  UnPinIcon,
} from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { usePinOrUnpinTipis } from "@/utils/pinedTabs/hook"
import { useNavigateToRunTipis } from "@/utils/routeHelper/hook"
import { IActionGroupProps } from "../interface"
import { actionGroupContainerStyle } from "./style"

const PCActionGroup: FC<IActionGroupProps> = (props) => {
  const {
    isContribute,
    runNumber,
    forkNumber,
    tipisID,
    tipisIcon,
    tipisName,
    isFromMarketplace,
    ownerTeamIdentity,
    isPublishConfiguration,
  } = props
  const { t } = useTranslation()
  const navigateToRun = useNavigateToRunTipis()
  const pinedInfos = useSelector((state) =>
    getPinedTipisByTipisID(state, tipisID),
  )

  const isPined = !!pinedInfos
  const pinOrUnpinTipis = usePinOrUnpinTipis()
  const handleClickPinOrUnPin = async () => {
    await pinOrUnpinTipis({
      tipiName: tipisName,
      tipiIcon: tipisIcon,
      tipiID: tipisID,
      tipiOwnerTeamIdentity: ownerTeamIdentity,
    })
  }

  const handleClickRun = () => {
    TipisTrack.track("click_run_tipi_entry", {
      parameter1: "detail",
    })
    navigateToRun(
      {
        tipisIcon,
        tipisID,
        tipisName,
      },
      v4(),
      ownerTeamIdentity,
    )
  }

  return (
    <div css={actionGroupContainerStyle}>
      <Button
        type="primary"
        block
        size="large"
        icon={<Icon component={PlayFillIcon} />}
        style={{ maxWidth: "307px" }}
        onClick={handleClickRun}
      >
        {t("dashboard.common.run")} {isContribute ? runNumber : ""}
      </Button>
      {isFromMarketplace && isPublishConfiguration && (
        <Button icon={<Icon component={ForkIcon} />} size="large">
          {t("dashboard.common.fork")} {forkNumber}
        </Button>
      )}

      <Button
        icon={<Icon component={isPined ? UnPinIcon : PinIcon} />}
        onClick={handleClickPinOrUnPin}
        size="large"
      >
        {isPined ? t("dashboard.common.unpin") : t("dashboard.common.pin")}
      </Button>

      {isContribute && (
        <Button icon={<Icon component={ShareIcon} />} size="large">
          {t("dashboard.common.share")}
        </Button>
      )}
    </div>
  )
}

export default PCActionGroup
