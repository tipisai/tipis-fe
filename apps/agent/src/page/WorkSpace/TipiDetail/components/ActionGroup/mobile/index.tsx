import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import {
  ForkIcon,
  PlayFillIcon,
  ShareIcon,
  StarOutlineIcon,
} from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
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
    starNumber,
    tipisID,
    tipisIcon,
    tipisName,
  } = props
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
      {isContribute && (
        <div css={otherActionGroupContainerStyle}>
          <Button block icon={<Icon component={ForkIcon} />} size="large">
            {t("dashboard.common.fork")} {forkNumber}
          </Button>
          <Button
            block
            icon={<Icon component={StarOutlineIcon} />}
            size="large"
          >
            {t("marketplace.star")} {starNumber}
          </Button>
          <Button block icon={<Icon component={ShareIcon} />} size="large">
            {t("dashboard.common.share")}
          </Button>
        </div>
      )}
    </div>
  )
}

export default MobileActionGroup
