import { Divider } from "antd"
import { FC } from "react"
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
  return (
    <section css={menuContainerStyle}>
      <div css={menuInnerContainerStyle}>
        <div css={menuContentStyle}>
          <MenuHeader />
          <TeamSelectAndInviteButton />
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
  )
}

export default PCWorkspaceMenu
