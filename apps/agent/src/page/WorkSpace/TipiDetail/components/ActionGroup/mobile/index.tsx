import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
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
import { MarketShareModal } from "@illa-public/market-share"
import { TipisTrack } from "@illa-public/track-utils"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { usePinOrUnpinTipis } from "@/utils/pinedTabs/hook"
import { useNavigateToRunTipis } from "@/utils/routeHelper/hook"
import { IActionGroupProps } from "../interface"
import {
  actionGroupContainerStyle,
  otherActionGroupContainerStyle,
} from "./style"

const MobileActionGroup: FC<IActionGroupProps> = (props) => {
  const {
    isContribute,
    runNumber,
    forkNumber,
    tipisID,
    tipisIcon,
    tipisName,
    isFromMarketplace,
    isPublishConfiguration,
    ownerTeamIdentity,
  } = props
  const { t } = useTranslation()
  const navigateToRun = useNavigateToRunTipis()
  const pinedInfos = useSelector((state) =>
    getPinedTipisByTipisID(state, tipisID),
  )
  const [shareVisible, setShareVisible] = useState(false)
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
    <>
      <div css={actionGroupContainerStyle}>
        <Button
          type="primary"
          size="large"
          block
          icon={<Icon component={PlayFillIcon} />}
          onClick={handleClickRun}
        >
          {t("dashboard.common.run")} {isContribute ? runNumber : ""}
        </Button>

        <div css={otherActionGroupContainerStyle}>
          {isFromMarketplace && isPublishConfiguration && (
            <Button block icon={<Icon component={ForkIcon} />} size="large">
              {t("dashboard.common.fork")} {forkNumber}
            </Button>
          )}

          <Button
            block
            icon={<Icon component={isPined ? UnPinIcon : PinIcon} />}
            onClick={handleClickPinOrUnPin}
            size="large"
          >
            {isPined ? t("dashboard.common.unpin") : t("dashboard.common.pin")}
          </Button>
          {isContribute && (
            <Button
              block
              icon={<Icon component={ShareIcon} />}
              size="large"
              onClick={() => setShareVisible(true)}
            >
              {t("dashboard.common.share")}
            </Button>
          )}
        </div>
      </div>
      <MarketShareModal
        title={`${t("user_management.modal.social_media.default_text.agent", {
          tipisName: tipisName,
        })}`}
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        ID={tipisID}
        name={tipisName}
      />
    </>
  )
}

export default MobileActionGroup
