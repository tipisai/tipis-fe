import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import {
  ForkIcon,
  PlayFillIcon,
  ShareIcon,
  StarOutlineIcon,
} from "@illa-public/icon"
import { IActionGroupProps } from "./interface"
import { actionGroupContainerStyle } from "./style"

const ActionGroup: FC<IActionGroupProps> = (props) => {
  const { isContribute, runNumber, forkNumber, starNumber } = props
  const { t } = useTranslation()
  return (
    <div css={actionGroupContainerStyle}>
      <Button
        type="primary"
        block
        icon={<Icon component={PlayFillIcon} />}
        style={{ maxWidth: "307px" }}
      >
        {t("dashboard.common.run")} {isContribute ? runNumber : ""}
      </Button>
      {isContribute && (
        <Button block icon={<Icon component={ForkIcon} />}>
          {t("dashboard.common.fork")} {forkNumber}
        </Button>
      )}
      {isContribute && (
        <Button block icon={<Icon component={StarOutlineIcon} />}>
          {t("marketplace.star")} {starNumber}
        </Button>
      )}
      {isContribute && (
        <Button block icon={<Icon component={ShareIcon} />}>
          {t("dashboard.common.share")}
        </Button>
      )}
    </div>
  )
}

export default ActionGroup
