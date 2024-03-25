import { Tabs } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import TeamCardList from "../components/TeamCardList"
import HeaderTools from "./components/HeaderTools"
import PCTeamCardListItem from "./components/TeamCardListItem"
import { tabsContainerStyle, tipisPCDashboardContainerStyle } from "./style"

const TipisPCDashboard: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={tipisPCDashboardContainerStyle}>
      <WorkspacePCHeaderLayout
        title={t("homepage.tipi_dashboard.title.tipi_dashboard")}
        extra={<HeaderTools />}
      />
      <div css={tabsContainerStyle}>
        <Tabs
          items={[
            {
              label: t("homepage.tipi_dashboard.tab.team"),
              key: "team",
              children: <TeamCardList RenderItem={PCTeamCardListItem} />,
            },
            {
              label: t("homepage.tipi_dashboard.tab.marketplace"),
              key: "marketplace",
              children: "Marketplace",
            },
          ]}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  )
}

export default TipisPCDashboard
