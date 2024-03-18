import { Divider } from "antd"
import { FC, useState } from "react"
import CreateTeamModal from "../../components/CreateTeamModal"
import FeatureArea from "../FeatureArea"
import MenuFooter from "../MenuFooter"
import MenuHeader from "../MenuHeader"
import RecentTabs from "../RecentTabs"
import TeamSelectAndInviteButton from "../TeamSelectAndInviteButton"
import {
  dividerContainerStyle,
  menuContainerStyle,
  menuContentStyle,
  menuInnerContainerStyle,
} from "./style"

const PCWorkspaceMenu: FC = () => {
  const [createTeamVisible, setCreateTeamVisible] = useState(false)
  return (
    <>
      <section css={menuContainerStyle}>
        <div css={menuInnerContainerStyle}>
          <div css={menuContentStyle}>
            <MenuHeader />
            <TeamSelectAndInviteButton
              openCreateModal={() => setCreateTeamVisible(true)}
            />
            <FeatureArea />
            <div css={dividerContainerStyle}>
              <Divider
                style={{
                  margin: "0",
                }}
              />
            </div>
            <RecentTabs />
          </div>
          <MenuFooter />
        </div>
      </section>
      <CreateTeamModal
        visible={createTeamVisible}
        onCancel={() => setCreateTeamVisible(false)}
      />
    </>
  )
}

export default PCWorkspaceMenu
