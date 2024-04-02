import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import { createTeamContext } from "@/Layout/Workspace/context"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import EmptyTeamIcon from "@/assets/workspace/emptyTeam.svg?react"
import {
  contentContainerStyle,
  contentStyle,
  emptyIconStyle,
  titleStyle,
} from "./style"

const EmptyMobile: FC = () => {
  const { t } = useTranslation()

  const { onChangeTeamVisible } = useContext(createTeamContext)

  return (
    <MobileFirstPageLayout title={""} headerExtra={null}>
      <section css={contentContainerStyle}>
        <div css={contentStyle}>
          <h1 css={titleStyle}>{t("tipi_billing.you_have_no_teams")}</h1>
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
      </section>
    </MobileFirstPageLayout>
  )
}

export default EmptyMobile
