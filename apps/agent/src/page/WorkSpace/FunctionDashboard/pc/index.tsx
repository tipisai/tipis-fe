import { Tabs } from "antd"
import { FC } from "react"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import HeaderTools from "./components/HeaderTools"
import TeamCardList from "./components/TeamCardList"
import { tabsContainerStyle } from "./style"

const FunctionPCDashboard: FC = () => {
  return (
    <>
      <WorkspacePCHeaderLayout
        title="Function dashboard"
        extra={<HeaderTools />}
      />
      <div css={tabsContainerStyle}>
        <Tabs
          items={[
            {
              label: "Team",
              key: "team",
              children: <TeamCardList />,
            },
            {
              label: "Official",
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
