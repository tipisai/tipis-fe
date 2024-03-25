import { Divider, Drawer } from "antd"
import { FC, useState } from "react"
import FeatureArea from "@/Layout/Workspace/modules/FeatureArea"
import MenuFooter from "@/Layout/Workspace/modules/MenuFooter"
import MobileMenuIcon from "@/assets/workspace/mobileMenu.svg?react"
import WorkspaceMobileHeaderLayout from "../../components/Header"
import { IEmptyPageLayoutMobile } from "./interface"
import {
  customDrawStyle,
  dividerContainerStyle,
  menuContentStyle,
} from "./style"

const EmptyPageLayoutMobile: FC<IEmptyPageLayoutMobile> = (props) => {
  const { children, title, openCreateModal } = props
  const [openDrawer, setOpenDrawer] = useState(false)

  const showDrawer = () => {
    setOpenDrawer(true)
  }

  const onClose = () => {
    setOpenDrawer(false)
  }

  return (
    <>
      <WorkspaceMobileHeaderLayout
        title={title}
        closeIcon={MobileMenuIcon}
        onClickClose={showDrawer}
        customRenderTitle={() => {
          return <></>
        }}
      />
      {children}
      <Drawer
        onClose={onClose}
        open={openDrawer}
        placement="left"
        closeIcon={false}
        width={300}
        css={customDrawStyle}
      >
        <div css={menuContentStyle}>
          <FeatureArea openCreateModal={openCreateModal} />
          <div css={dividerContainerStyle}>
            <Divider
              style={{
                margin: "0",
              }}
            />
          </div>
        </div>
        <MenuFooter />
      </Drawer>
    </>
  )
}

export default EmptyPageLayoutMobile
