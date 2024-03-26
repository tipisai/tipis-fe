import { Tabs } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import MarketCardList from "../components/MarketCardList"
import TeamCardList from "../components/TeamCardList"
import { MarketListProvider } from "../context/marketListContext"
import EmptyMarketList from "./components/EmptyMarketList"
import HeaderTools from "./components/HeaderTools"
import MarketCard from "./components/MarketCard"
import SortComponentPC from "./components/SortComponent"
import PCTeamCardListItem from "./components/TeamCardListItem"
import { TABS_KEY } from "./constant"
import { tabsContainerStyle, tipisPCDashboardContainerStyle } from "./style"

const TipisPCDashboard: FC = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(TABS_KEY.TEAM)
  return (
    <MarketListProvider>
      <div css={tipisPCDashboardContainerStyle}>
        <WorkspacePCHeaderLayout
          title={t("homepage.tipi_dashboard.title.tipi_dashboard")}
          extra={<HeaderTools activeTab={activeTab} />}
        />
        <div css={tabsContainerStyle}>
          <Tabs
            items={[
              {
                label: t("homepage.tipi_dashboard.tab.team"),
                key: TABS_KEY.TEAM,
                children: <TeamCardList RenderItem={PCTeamCardListItem} />,
              },
              {
                label: t("homepage.tipi_dashboard.tab.marketplace"),
                key: TABS_KEY.MARKETPLACE,
                children: (
                  <MarketCardList
                    RenderEmpty={EmptyMarketList}
                    RenderItem={MarketCard}
                    RenderSortBy={SortComponentPC}
                  />
                ),
              },
            ]}
            style={{ height: "100%" }}
            onChange={(activeTab) => setActiveTab(activeTab as TABS_KEY)}
          />
        </div>
      </div>
    </MarketListProvider>
  )
}

export default TipisPCDashboard
