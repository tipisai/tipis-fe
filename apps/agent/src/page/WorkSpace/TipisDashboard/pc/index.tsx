import { Tabs } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
// import MarketCardList from "../components/MarketCardList"
import TeamCardList from "../components/TeamCardList"
import { DASH_BOARD_UI_STATE_ACTION_TYPE } from "../context/interface"
import { DashBoardUIStateContext } from "../context/marketListContext"
// import EmptyMarketList from "./components/EmptyMarketList"
import HeaderTools from "./components/HeaderTools"
// import MarketCard from "./components/MarketCard"
// import SortComponentPC from "./components/SortComponent"
import PCTeamCardListItem from "./components/TeamCardListItem"
import { TABS_KEY } from "./constant"
import { tabsContainerStyle, tipisPCDashboardContainerStyle } from "./style"

const TipisPCDashboard: FC = () => {
  const { t } = useTranslation()
  const { dashboardUIState, dispatch } = useContext(DashBoardUIStateContext)
  const { activeTab } = dashboardUIState
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
              key: TABS_KEY.TEAM,
              children: <TeamCardList RenderItem={PCTeamCardListItem} />,
            },
            // {
            //   label: t("homepage.tipi_dashboard.tab.marketplace"),
            //   key: TABS_KEY.MARKETPLACE,
            //   children: (
            //     <MarketCardList
            //       RenderEmpty={EmptyMarketList}
            //       RenderItem={MarketCard}
            //       RenderSortBy={SortComponentPC}
            //     />
            //   ),
            // },
          ]}
          activeKey={activeTab}
          style={{ height: "100%" }}
          onChange={(activeTab) => {
            dispatch({
              type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_ACTIVE_TAB,
              payload: activeTab as TABS_KEY,
            })
          }}
        />
      </div>
    </div>
  )
}

export default TipisPCDashboard
