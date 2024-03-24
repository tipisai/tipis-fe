import { Tabs } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import HeaderTools from "./components/HeaderTools"
import DashboardContent from "./modules/DashboardContent"
import { tabsContainerStyle, tipisMobileDashboardContainerStyle } from "./style"

const TipisMobileDashboard: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={tipisMobileDashboardContainerStyle}>
      <MobileFirstPageLayout
        title={t("homepage.tipi_dashboard.title.tipi_dashboard")}
        headerExtra={<HeaderTools />}
      >
        <div css={tabsContainerStyle}>
          <Tabs
            items={[
              {
                label: t("homepage.tipi_dashboard.tab.team"),
                key: "team",
                children: <DashboardContent />,
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
      </MobileFirstPageLayout>
    </div>
  )
}

export default TipisMobileDashboard
