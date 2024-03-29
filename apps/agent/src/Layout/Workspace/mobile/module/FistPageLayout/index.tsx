import { Divider, Drawer } from "antd"
import { FC, useState } from "react"
import CreateTeamModal from "@/Layout/Workspace/components/CreateTeamModal"
import FeatureArea from "@/Layout/Workspace/modules/FeatureArea"
import MenuFooter from "@/Layout/Workspace/modules/MenuFooter"
import RecentTabs from "@/Layout/Workspace/modules/RecentTabs"
import TeamSelectAndInviteButton from "@/Layout/Workspace/modules/TeamSelectAndInviteButton"
import MobileMenuIcon from "@/assets/workspace/mobileMenu.svg?react"
import WorkspaceMobileHeaderLayout from "../../components/Header"
import { IFirstPageLayoutProps } from "./interface"
import {
  customDrawStyle,
  dividerContainerStyle,
  menuContentStyle,
  mobileFirstPageLayoutContainerStyle,
} from "./style"

const MobileFirstPageLayout: FC<IFirstPageLayoutProps> = (props) => {
  const { headerExtra, children, customRenderTitle, title } = props
  const [openDrawer, setOpenDrawer] = useState(false)
  const [createTeamVisible, setCreateTeamVisible] = useState(false)

  const showDrawer = () => {
    setOpenDrawer(true)
  }

  const onClose = () => {
    setOpenDrawer(false)
  }

  return (
    <div css={mobileFirstPageLayoutContainerStyle}>
      <WorkspaceMobileHeaderLayout
        title={title}
        extra={headerExtra}
        closeIcon={MobileMenuIcon}
        onClickClose={showDrawer}
        customRenderTitle={customRenderTitle}
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
          <FeatureArea
            openCreateModal={() => {
              setCreateTeamVisible(true)
            }}
          />
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
    </div>
  )
}

export default MobileFirstPageLayout
