import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import EmptyTeamIcon from "@/assets/workspace/emptyTeam.svg?react"
import { IEmptyFunctionContentPCProps } from "./interface"
import { containerStyle, emptyIconStyle } from "./style"

const EmptyFunctionContentPC: FC<IEmptyFunctionContentPCProps> = ({
  handleClickCreate,
}) => {
  const { t } = useTranslation()
  return (
    <div css={containerStyle}>
      <span>{t("editor.action.form.title.general.no_function")}</span>
      <Icon component={EmptyTeamIcon} css={emptyIconStyle} />
      <Button
        icon={<Icon component={AddIcon} />}
        size="large"
        onClick={handleClickCreate}
      >
        {t("editor.action.form.button.general.create_new")}
      </Button>
    </div>
  )
}

export default EmptyFunctionContentPC
