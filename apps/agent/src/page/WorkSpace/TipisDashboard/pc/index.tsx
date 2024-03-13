import { Tabs } from "antd"
import { FC } from "react"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import HeaderTools from "./components/HeaderTools"
import TeamCardList from "./components/TeamCardList"
import { tabsContainerStyle } from "./style"

const TipisPCDashboard: FC = () => {
  return (
    <>
      <WorkspacePCHeaderLayout title="Tipi dashboard" extra={<HeaderTools />} />
      <div css={tabsContainerStyle}>
        <Tabs
          items={[
            {
              label: "Team",
              key: "team",
              children: <TeamCardList />,
            },
            {
              label: "Marketplace",
              key: "marketplace",
              children: "Marketplace",
            },
          ]}
        />
      </div>
    </>
  )
}

export default TipisPCDashboard
