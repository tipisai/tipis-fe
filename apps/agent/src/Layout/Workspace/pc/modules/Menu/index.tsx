import { Divider } from "antd"
import { FC, useState } from "react"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
import CreateTeamModal from "@/Layout/Workspace/components/CreateTeamModal"
import FeatureArea from "@/Layout/Workspace/modules/FeatureArea"
import MenuFooter from "@/Layout/Workspace/modules/MenuFooter"
import RecentTabs from "@/Layout/Workspace/modules/RecentTabs"
import TeamSelectAndInviteButton from "@/Layout/Workspace/modules/TeamSelectAndInviteButton"
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

  const { data, isSuccess } = useGetTeamsInfoQuery(null)

  const hasTeamInfos = Array.isArray(data) && data.length > 0

  return (
    isSuccess && (
      <>
        <section css={menuContainerStyle}>
          <div css={menuInnerContainerStyle}>
            <div css={menuContentStyle}>
              <MenuHeader />
              {hasTeamInfos && (
                <div css={teamSelectAndInviteButtonContainerStyle}>
                  <TeamSelectAndInviteButton />
                </div>
              )}
              <FeatureArea />
              {hasTeamInfos && (
                <>
                  <div css={dividerContainerStyle}>
                    <Divider
                      style={{
                        margin: "0",
                      }}
                    />
                  </div>
                  <RecentTabs isMiniSize={false} />
                </>
              )}
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
  )
}

export default PCWorkspaceMenu
