import { Tabs } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import DashboardContent from "./modules/DashboardContent"
import {
  functionMobileDashboardContainerStyle,
  tabsContainerStyle,
} from "./style"

const FunctionsMobileDashboard: FC = () => {
  const { t } = useTranslation()

  return (
    <div css={functionMobileDashboardContainerStyle}>
      <MobileFirstPageLayout
        title={t("homepage.function_dashboard.title.function_dashboard")}
        headerExtra={<div />}
      >
        <div css={tabsContainerStyle}>
          <Tabs
            items={[
              {
                label: t("homepage.function_dashboard.tab.team"),
                key: "team",
                children: <DashboardContent />,
              },
            ]}
            style={{ height: "100%" }}
            activeKey="team"
          />
        </div>
      </MobileFirstPageLayout>
    </div>
  )
}

export default FunctionsMobileDashboard
