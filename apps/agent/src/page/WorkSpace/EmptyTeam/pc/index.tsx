import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import EmptyTeamMenu from "@/Layout/Workspace/pc/modules/EmptyTeamMenu"
import MiniMenu from "@/Layout/Workspace/pc/modules/EmptyTeamMenu/MiniMenu"
import {
  MenuStatusUIContext,
  MenuStatusUIProvider,
} from "@/Layout/Workspace/pc/modules/Menu/context"
import EmptyTeamIcon from "../assets/emptyTeam.svg?react"
import { EmptyTeamProps } from "../interface"
import {
  contentContainerStyle,
  contentStyle,
  emptyIconStyle,
  titleStyle,
  workspaceLayoutContainerStyle,
} from "./style"

const EmptyTeamMenuWrapper: FC<EmptyTeamProps> = ({ openCreateTeam }) => {
  const { collapsed } = useContext(MenuStatusUIContext)
  const { t } = useTranslation()

  return (
    <div css={workspaceLayoutContainerStyle}>
      {collapsed ? (
        <MiniMenu />
      ) : (
        <EmptyTeamMenu openCreateModal={openCreateTeam} />
      )}
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
    </div>
  )
}

const EmptyTeamPC: FC<EmptyTeamProps> = (props) => {
  return (
    <>
      <Helmet>
        <title>no-team</title>
      </Helmet>
      <MenuStatusUIProvider>
        <EmptyTeamMenuWrapper {...props} />
      </MenuStatusUIProvider>
    </>
  )
}

export default EmptyTeamPC
