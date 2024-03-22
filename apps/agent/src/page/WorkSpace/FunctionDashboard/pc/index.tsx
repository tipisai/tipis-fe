import { Tabs } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import HeaderTools from "./components/HeaderTools"
import TeamCardList from "./components/TeamCardList"
import { tabsContainerStyle } from "./style"

const FunctionPCDashboard: FC = () => {
  const { t } = useTranslation()
  return (
    <>
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
              children: <TeamCardList />,
            },
            {
              label: t("homepage.function_dashboard.tab.official"),
              key: "official",
              children: "Official",
            },
          ]}
        />
      </div>
    </>
  )
}

export default FunctionPCDashboard
