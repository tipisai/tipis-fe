import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { PlusIcon, ResultEmptyIcon } from "@illa-public/icon"
import { ITeamNoDataProps } from "./interface"
import {
  emptyContentContainerStyle,
  emptyDescStyle,
  iconContainerStyle,
  teamNoDataContainerStyle,
} from "./style"

const TeamNoData: FC<ITeamNoDataProps> = (props) => {
  const { showCreate, onClickButton } = props
  const { t } = useTranslation()
  return (
    <div css={teamNoDataContainerStyle}>
      <div css={emptyContentContainerStyle}>
        <div css={iconContainerStyle}>
          <Icon component={ResultEmptyIcon} />
        </div>
        <p css={emptyDescStyle}>{t("new_dashboard.desc.blank")}</p>
        {showCreate && (
          <Button icon={<Icon component={PlusIcon} />} onClick={onClickButton}>
            {t("new_dashboard.button.blank")}
          </Button>
        )}
      </div>
    </div>
  )
}

export default TeamNoData
