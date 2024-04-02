import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import { createTeamContext } from "@/Layout/Workspace/context"
import EmptyTeamIcon from "@/assets/workspace/emptyTeam.svg?react"
import {
  contentStyle,
  emptyContainerStyle,
  emptyIconStyle,
  titleStyle,
} from "./style"

const EmptyTeamPC: FC = () => {
  const { t } = useTranslation()

  const { onChangeTeamVisible } = useContext(createTeamContext)

  return (
    <div css={emptyContainerStyle}>
      <div css={contentStyle}>
        <h2 css={titleStyle}>{t("tipi_billing.you_have_no_teams")}</h2>
        <Icon component={EmptyTeamIcon} css={emptyIconStyle} />
        <Button
          size="large"
          icon={<Icon component={AddIcon} />}
          onClick={() => {
            onChangeTeamVisible?.(true)
          }}
        >
          {t("tipi_billing.create_a_new_team")}
        </Button>
      </div>
    </div>
  )
}

export default EmptyTeamPC
