import { Divider } from "antd"
import { FC, useState } from "react"
import FeatureArea from "../../../modules/FeatureArea"
import MenuFooter from "../../../modules/MenuFooter"
import RecentTabs from "../../../modules/RecentTabs"
import TeamSelectAndInviteButton from "../../../modules/TeamSelectAndInviteButton"
import CreateTeamModal from "../../components/CreateTeamModal"
import MenuHeader from "../MenuHeader"
import {
  dividerContainerStyle,
  menuContainerStyle,
  menuContentStyle,
  menuInnerContainerStyle,
  teamSelectAndInviteButtonContainerStyle,
} from "./style"

const PCWorkspaceMenu: FC = () => {
  const [createTeamVisible, setCreateTeamVisible] = useState(false)
  return (
    <>
      <section css={menuContainerStyle}>
        <div css={menuInnerContainerStyle}>
          <div css={menuContentStyle}>
            <MenuHeader />
            <div css={teamSelectAndInviteButtonContainerStyle}>
              <TeamSelectAndInviteButton
                openCreateModal={() => setCreateTeamVisible(true)}
              />
            </div>
            <FeatureArea />
            <div css={dividerContainerStyle}>
              <Divider
                style={{
                  margin: "0",
                }}
              />
            </div>
            <RecentTabs isMiniSize={false} />
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
