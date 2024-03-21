import { Divider, Drawer } from "antd"
import { FC, useState } from "react"
import MobileMenuIcon from "@/assets/workspace/mobileMenu.svg?react"
import MenuFooter from "../../../modules/MenuFooter"
import RecentTabs from "../../../modules/RecentTabs"
import TeamSelectAndInviteButton from "../../../modules/TeamSelectAndInviteButton"
import CreateTeamModal from "../../../pc/components/CreateTeamModal"
import FeatureArea from "../../../pc/modules/FeatureArea"
import WorkspaceMobileHeaderLayout from "../../components/Header"
import { IFirstPageLayoutProps } from "./interface"
import {
  customDrawStyle,
  dividerContainerStyle,
  menuContentStyle,
} from "./style"

const MobileFirstPageLayout: FC<IFirstPageLayoutProps> = (props) => {
  const { headerExtra, children } = props
  const [openDrawer, setOpenDrawer] = useState(false)
  const [createTeamVisible, setCreateTeamVisible] = useState(false)

  const showDrawer = () => {
    setOpenDrawer(true)
  }

  const onClose = () => {
    setOpenDrawer(false)
  }

  return (
    <>
      <WorkspaceMobileHeaderLayout
        title="Chat"
        extra={headerExtra}
        closeIcon={MobileMenuIcon}
        onClickClose={showDrawer}
      />
      {children}
      <Drawer
        title={
          <TeamSelectAndInviteButton
            openCreateModal={() => {
              setCreateTeamVisible(true)
            }}
          />
        }
        onClose={onClose}
        open={openDrawer}
        placement="left"
        closeIcon={false}
        width={300}
        css={customDrawStyle}
      >
        <div css={menuContentStyle}>
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
      </Drawer>
      <CreateTeamModal
        visible={createTeamVisible}
        onCancel={() => setCreateTeamVisible(false)}
      />
    </>
  )
}

export default MobileFirstPageLayout
