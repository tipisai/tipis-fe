import { App } from "antd"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getTeamItems,
  teamActions,
  useDeleteTeamByIDMutation,
  useRemoveTeamMemberByIDMutation,
} from "@illa-public/user-data"
import store from "@/redux/store"
import { removeLocalTeamIdentifier, setLocalTeamIdentifier } from "@/utils/auth"
import { EMPTY_TEAM_PATH, getChatPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import DeleteTeamContent from "../components/DeleteTeamContent"
import { IModalInstance } from "./interface"

export const useLeaveTeamModal = () => {
  const [removeTeamMemberByID] = useRemoveTeamMemberByIDMutation()
  const { t } = useTranslation()
  const teamInfo = useGetCurrentTeamInfo()!
  const navigate = useNavigate()
  const { message, modal } = App.useApp()
  const dispatch = useDispatch()
  const modalInstance = useRef<IModalInstance | null>(null)

  const [deleteTeamByID] = useDeleteTeamByIDMutation()

  const handleCancelCallback = () => {
    // track(
    //   ILLA_MIXPANEL_EVENT_TYPE.CLICK,
    //   ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING,
    //   {
    //     element: "delete_modal_cancel",
    //     parameter1: isOwner ? "delete_button" : undefined,
    //     team_id: teamInfo?.identifier || "-1",
    //   },
    // )
    modalInstance.current?.destroy()
  }

  const leaveTeam = async () => {
    if (!teamInfo?.teamMemberID) return
    try {
      removeTeamMemberByID({
        teamID: teamInfo.id,
        teamMemberID: teamInfo?.teamMemberID,
      }).unwrap()
      const teamItems = getTeamItems(store.getState()) ?? []
      const newTeamItems = teamItems.filter((team) => team.id !== teamInfo.id)
      if (Array.isArray(newTeamItems) && newTeamItems.length > 0) {
        setLocalTeamIdentifier(newTeamItems[0].identifier)
        dispatch(teamActions.updateCurrentIdReducer(newTeamItems[0].id))
        navigate(getChatPath(newTeamItems[0].identifier), {
          replace: true,
        })
      } else {
        removeLocalTeamIdentifier()
        navigate(EMPTY_TEAM_PATH, {
          replace: true,
        })
      }
    } catch (error) {
      message.error(t("team_setting.mes.leave_fail"))
    } finally {
      modalInstance.current?.destroy()
    }
  }

  const deleteTeam = async () => {
    try {
      deleteTeamByID(teamInfo?.id || "")
      message.success({
        content: t("team_setting.mes.delete_suc"),
      })
      const teamItems = getTeamItems(store.getState()) ?? []
      const newTeamItems = teamItems.filter((team) => team.id !== teamInfo.id)
      if (Array.isArray(newTeamItems) && newTeamItems.length > 0) {
        setLocalTeamIdentifier(newTeamItems[0].identifier)
        dispatch(teamActions.updateCurrentIdReducer(newTeamItems[0].id))
        navigate(getChatPath(newTeamItems[0].identifier), {
          replace: true,
        })
      } else {
        removeLocalTeamIdentifier()
        navigate(EMPTY_TEAM_PATH, {
          replace: true,
        })
      }
    } catch (e) {
      if (isILLAAPiError(e)) {
        switch (e.data.errorFlag) {
          case ERROR_FLAG.ERROR_FLAG_CAN_NOT_DELETE_TEAM_DUE_TO_LICENSE_REMAINS: {
            message.error({
              content: t("billing.message.in_subscription_can_not_delete"),
            })
            return
          }
        }
      }
      message.error({
        content: t("team_setting.mes.delete_fail"),
      })
    } finally {
      modalInstance.current?.destroy()
    }
  }

  const showLeaveTeamModal = () => {
    modalInstance.current = modal.confirm({
      centered: true,
      title: t("team_setting.leave_modal.title"),
      content: t("team_setting.leave_modal.description"),
      onOk: leaveTeam,
      onCancel: handleCancelCallback,
      okText: t("team_setting.leave_modal.leave"),
      cancelButtonProps: {
        size: "large",
      },
      okButtonProps: {
        danger: true,
        size: "large",
        type: "primary",
      },
      cancelText: t("team_setting.delete_modal.cancel"),
    })
  }

  const showDeleteTeamModal = () => {
    modalInstance.current = modal.confirm({
      centered: true,
      title: t("team_setting.delete_modal.title"),
      content: (
        <DeleteTeamContent
          onCancel={handleCancelCallback}
          deleteTeam={deleteTeam}
          teamInfo={teamInfo}
        />
      ),
      footer: false,
      // onOk: deleteTeam,
      // onCancel: handleCancelCallback,
      // okText: t("team_setting.delete_modal.delete"),
      // cancelButtonProps: {
      //   size: "large",
      // },
      // okButtonProps: {
      //   danger: true,
      //   size: "large",
      //   type: "primary",
      // },
      // cancelText: t("team_setting.delete_modal.cancel"),
    })
  }

  const handleLeaveOrDeleteTeamModal = () => {
    // track(
    //   ILLA_MIXPANEL_EVENT_TYPE.SHOW,
    //   ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING,
    //   {
    //     element: "delete_modal",
    //     parameter1: isOwner ? "delete_button" : undefined,
    //     team_id: teamInfo?.identifier || "-1",
    //   },
    // )
    if (teamInfo.myRole === USER_ROLE.OWNER) {
      showDeleteTeamModal()
    } else {
      showLeaveTeamModal()
    }
  }

  return handleLeaveOrDeleteTeamModal
}
