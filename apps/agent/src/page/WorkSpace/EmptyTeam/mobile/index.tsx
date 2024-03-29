import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import EmptyPageLayoutMobile from "@/Layout/Workspace/mobile/module/EmptyPageLayout"
import EmptyTeamIcon from "../assets/emptyTeam.svg?react"
import { EmptyTeamProps } from "../interface"
import {
  contentContainerStyle,
  contentStyle,
  emptyIconStyle,
  titleStyle,
} from "./style"

const EmptyTeamMobile: FC<EmptyTeamProps> = ({ openCreateTeam }) => {
  const { t } = useTranslation()
  return (
    <EmptyPageLayoutMobile openCreateModal={openCreateTeam} title="empty page">
      <section css={contentContainerStyle}>
        <div css={contentStyle}>
          <h1 css={titleStyle}>{t("tipi_billing.you_have_no_teams")}</h1>
          <Icon component={EmptyTeamIcon} css={emptyIconStyle} />
          <Button
            size="large"
            icon={<Icon component={AddIcon} />}
            onClick={openCreateTeam}
          >
            {t("tipi_billing.create_a_new_team")}
          </Button>
        </div>
      </section>
    </EmptyPageLayoutMobile>
  )
}

export default EmptyTeamMobile
