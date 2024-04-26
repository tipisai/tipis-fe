import { Tabs } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import HeaderTools from "./components/HeaderTools"
import TeamCardList from "./components/TeamCardList"
import {
  cardListContainerStyle,
  functionPCDashboardContainerStyle,
  tabsContainerStyle,
} from "./style"

const FunctionPCDashboard: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={functionPCDashboardContainerStyle}>
      <WorkspacePCHeaderLayout
        title={t("homepage.function_dashboard.title.function_dashboard")}
        extra={<HeaderTools />}
      />
      <div css={tabsContainerStyle}>
        <Tabs
          items={[
            {
              label: t("homepage.function_dashboard.tab.team"),
              key: "team",
              children: (
                <div css={cardListContainerStyle}>
                  <TeamCardList />
                </div>
              ),
            },
          ]}
          activeKey="team"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  )
}

export default FunctionPCDashboard
