import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import { ForkIcon, PinIcon, PlayFillIcon, ShareIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { useNavigateToRunTipis } from "@/utils/routeHelper/hook"
import { IActionGroupProps } from "../interface"
import {
  actionGroupContainerStyle,
  otherActionGroupContainerStyle,
} from "./style"

const MobileActionGroup: FC<IActionGroupProps> = (props) => {
  const { isContribute, runNumber, forkNumber, tipisID, tipisIcon, tipisName } =
    props
  const { t } = useTranslation()
  const navigateToRun = useNavigateToRunTipis()

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
    )
  }

  return (
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
        {isContribute && (
          <Button block icon={<Icon component={ForkIcon} />} size="large">
            {t("dashboard.common.fork")} {forkNumber}
          </Button>
        )}

        <Button block icon={<Icon component={PinIcon} />}>
          {t("dashboard.common.pin")}
        </Button>
        {isContribute && (
          <Button block icon={<Icon component={ShareIcon} />} size="large">
            {t("dashboard.common.share")}
          </Button>
        )}
      </div>
    </div>
  )
}

export default MobileActionGroup
