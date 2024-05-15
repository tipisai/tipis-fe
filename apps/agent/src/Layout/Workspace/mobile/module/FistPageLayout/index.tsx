import { App, Drawer } from "antd"
import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import FeatureArea from "@/Layout/Workspace/modules/FeatureArea"
import MenuFooter from "@/Layout/Workspace/modules/MenuFooter"
import MobilePinedTipisArea from "@/Layout/Workspace/modules/PinedTipis/mobile"
import MobileRecentTabs from "@/Layout/Workspace/modules/RecentTabs/mobile"
import TeamSelectAndInviteButton from "@/Layout/Workspace/modules/TeamSelectAndInviteButton"
import {
  COMMON_MENU_PINED_AREA_MIN_HEIGHT,
  COMMON_MENU_PINED_AREA_SINGLE_MIN_HEIGHT,
} from "@/Layout/Workspace/pc/config"
import MobileMenuIcon from "@/assets/workspace/mobileMenu.svg?react"
import { getPinedTipis } from "@/redux/ui/pinedTipis/selector"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { useRemoveAllRecentTabReducer } from "@/utils/recentTabs/baseHook"
import { getChatPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import WorkspaceMobileHeaderLayout from "../../components/Header"
import { IFirstPageLayoutProps } from "./interface"
import {
  closeAllContainerStyle,
  closeAllTextStyle,
  customDrawStyle,
  dividerInnerContainerStyle,
  dividerOuterContainerStyle,
  dividerStyle,
  menuContentStyle,
  mobileFirstPageLayoutContainerStyle,
} from "./style"

const MobileFirstPageLayout: FC<IFirstPageLayoutProps> = (props) => {
  const { headerExtra, children, customRenderTitle, title } = props
  const [openDrawer, setOpenDrawer] = useState(false)
  const { t } = useTranslation()
  const closeAll = useRemoveAllRecentTabReducer()
  const navigate = useNavigate()
  const { modal } = App.useApp()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const pinedTipis = useSelector(getPinedTipis)
  const [pinedAreaListHeight, setPinedAreaListHeight] = useState(0)

  const hasPinedTipis = pinedTipis.length > 0

  const recentTabInfos = useSelector(getRecentTabInfos)

  const handleClickCloseAll = () => {
    const onOkModal = async () => {
      await closeAll()
      navigate(getChatPath(currentTeamInfo?.identify ?? ""))
    }
    modal.confirm({
      content: t("homepage.edit_tipi.modal.not_save_desc"),
      okText: t("homepage.edit_tipi.modal.not_save_ok"),
      cancelText: t("homepage.edit_tipi.modal.not_save_cancel"),
      onOk: onOkModal,
    })
  }

  const showDrawer = () => {
    setOpenDrawer(true)
  }

  const onClose = () => {
    setOpenDrawer(false)
  }

  useEffect(() => {
    if (pinedTipis.length <= 3) {
      setPinedAreaListHeight(
        COMMON_MENU_PINED_AREA_SINGLE_MIN_HEIGHT * pinedTipis.length,
      )
    } else {
      setPinedAreaListHeight(COMMON_MENU_PINED_AREA_MIN_HEIGHT)
    }
  }, [pinedTipis.length])

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
        title={<TeamSelectAndInviteButton />}
        onClose={onClose}
        open={openDrawer}
        placement="left"
        closeIcon={false}
        width={300}
        css={customDrawStyle}
        push={false}
      >
        <div css={menuContentStyle}>
          <FeatureArea />
          {hasPinedTipis && (
            <MobilePinedTipisArea height={pinedAreaListHeight} />
          )}
          <div css={dividerOuterContainerStyle}>
            <div css={dividerInnerContainerStyle}>
              <div css={dividerStyle} className="divider" />
            </div>
            {recentTabInfos.length > 1 && (
              <div css={closeAllContainerStyle} onClick={handleClickCloseAll}>
                <span css={closeAllTextStyle}>
                  {t("homepage.left_panel.tab.clear_all")}
                </span>
              </div>
            )}
          </div>
          <MobileRecentTabs />
        </div>
        <MenuFooter />
      </Drawer>
    </div>
  )
}

export default MobileFirstPageLayout
