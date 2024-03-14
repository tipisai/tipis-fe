import { FC, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import { getCurrentTeamInfo, getCurrentUserID } from "@illa-public/user-data"
import LeaveTeamModal from "@/page/SettingPage/team/components/LeaveTeamModal"
import { track } from "@/utils/mixpanelHelper"
import SettingLayout from "./layout/pc"

export const Setting: FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const teamInfo = useSelector(getCurrentTeamInfo)
  const isOwner = teamInfo?.myRole === USER_ROLE.OWNER

  const isLogin = useSelector(getCurrentUserID)

  const openLeaveTeamModal = () => {
    setModalVisible(true)
    track(
      ILLA_MIXPANEL_EVENT_TYPE.SHOW,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING,
      {
        element: "delete_modal",
        parameter1: isOwner ? "delete_button" : undefined,
        team_id: teamInfo?.identifier || "-1",
      },
    )
  }
  const closeLeaveTeamModal = () => {
    setModalVisible(false)
    track(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING,
      {
        element: "delete_modal_cancel",
        parameter1: isOwner ? "delete_button" : undefined,
        team_id: teamInfo?.identifier || "-1",
      },
    )
  }

  return isLogin ? (
    <>
      <LayoutAutoChange
        desktopPage={
          <SettingLayout>
            <Outlet
              context={{
                onClickLeaveTeam: openLeaveTeamModal,
              }}
            />
          </SettingLayout>
        }
        mobilePage={
          <Outlet
            context={{
              onClickLeaveTeam: openLeaveTeamModal,
            }}
          />
        }
      />
      <LeaveTeamModal visible={modalVisible} onCancel={closeLeaveTeamModal} />
    </>
  ) : (
    <Navigate to="/user/login" replace={true} />
  )
}

Setting.displayName = "Setting"

export default Setting
