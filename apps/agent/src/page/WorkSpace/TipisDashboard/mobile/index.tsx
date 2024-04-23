import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import BlackTabs from "@/components/BlackTabs"
import { DASH_BOARD_UI_STATE_ACTION_TYPE, TABS_KEY } from "../context/interface"
import { DashBoardUIStateContext } from "../context/marketListContext"
import HeaderTools from "./components/HeaderTools"
import DashboardContent from "./modules/DashboardContent"
import MarketContent from "./modules/MarketContent"
import { tabsContainerStyle, tipisMobileDashboardContainerStyle } from "./style"

const TipisMobileDashboard: FC = () => {
  const { t } = useTranslation()
  const { dashboardUIState, dispatch } = useContext(DashBoardUIStateContext)
  const { activeTab } = dashboardUIState
  return (
    <div css={tipisMobileDashboardContainerStyle}>
      <MobileFirstPageLayout
        title={t("homepage.tipi_dashboard.title.tipi_dashboard")}
        headerExtra={<HeaderTools />}
      >
        <div css={tabsContainerStyle}>
          <BlackTabs
            items={[
              {
                label: t("homepage.tipi_dashboard.tab.team"),
                key: TABS_KEY.TEAM,
                children: <DashboardContent />,
              },
              {
                label: t("homepage.tipi_dashboard.tab.marketplace"),
                key: TABS_KEY.MARKETPLACE,
                children: <MarketContent />,
              },
            ]}
            style={{ height: "100%" }}
            activeKey={activeTab}
            onChange={(activeTab) => {
              dispatch({
                type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_ACTIVE_TAB,
                payload: activeTab as TABS_KEY,
              })
            }}
          />
        </div>
      </MobileFirstPageLayout>
    </div>
  )
}

export default TipisMobileDashboard
