import Icon from "@ant-design/icons"
import { App, Button, Dropdown, MenuProps, Switch } from "antd"
import { FC, MouseEvent, useCallback, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AuthShown, SHOW_RULES } from "@illa-public/auth-shown"
import { MoreIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  teamActions,
  useRemoveTeamMemberByIDMutation,
  useUpdateTeamPermissionConfigMutation,
} from "@illa-public/user-data"
import {
  allowEditorOrViewerInviteWrapperStyle,
  moreActionTextStyle,
} from "./style"

const stopPropagation = (e: MouseEvent) => {
  e.stopPropagation()
}
export const MoreAction: FC = () => {
  const { message, modal } = App.useApp()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { track } = useContext(MixpanelTrackContext)
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const {
    myRole: currentUserRole,
    teamMemberID: currentTeamMemberID,
    id: currentTeamID,
  } = currentTeamInfo
  const { allowEditorManageTeamMember, allowViewerManageTeamMember } =
    currentTeamInfo.permission
  const [allowInviteLoading, setAllowInviteLoading] = useState(false)

  const [removeTeamMember] = useRemoveTeamMemberByIDMutation()
  const [updateTeamPermissionConfig] = useUpdateTeamPermissionConfigMutation()
  const dispatch = useDispatch()

  const handleAfterLeaveTeam = useCallback(() => {
    navigate("/workspace", { replace: true })
    dispatch(teamActions.deleteTeamInfoReducer())
  }, [dispatch, navigate])

  const handleClickDeleteOrLeaveTeam = useCallback(() => {
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "leave",
    })
    track?.(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
      element: "leave_modal",
    })
    modal.confirm({
      title: t("team_setting.leave_modal.title"),
      content: t("team_setting.leave_modal.description"),
      okText: t("team_setting.leave_modal.leave"),
      cancelText: t("team_setting.leave_modal.cancel"),
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
          element: "leave_modal_leave",
        })
        try {
          await removeTeamMember({
            teamID: currentTeamID,
            teamMemberID: currentTeamMemberID,
          })
          message.success({
            content: t("team_setting.mes.leave_suc"),
          })
          track?.(ILLA_MIXPANEL_EVENT_TYPE.REQUEST, {
            element: "delete",
            parameter1: "delete_select",
          })
          handleAfterLeaveTeam?.()
        } catch (e) {
          message.error({
            content: t("team_setting.mes.leave_fail"),
          })
        }
      },
      onCancel: () => {
        track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
          element: "leave_modal_cancel",
        })
      },
    })
  }, [
    currentTeamID,
    currentTeamMemberID,
    handleAfterLeaveTeam,
    message,
    modal,
    removeTeamMember,
    t,
    track,
  ])

  const handleChangeInviteByEditor = async (value: boolean) => {
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "allow_manage",
      parameter2: value ? "on" : "off",
    })
    try {
      setAllowInviteLoading(true)
      await updateTeamPermissionConfig({
        teamID: currentTeamID,
        data: {
          allowEditorManageTeamMember: value,
          allowViewerManageTeamMember: value,
        },
      })
      dispatch(
        teamActions.updateTeamMemberPermissionReducer({
          teamID: currentTeamID,
          newPermission: {
            allowEditorManageTeamMember: value,
            allowViewerManageTeamMember: value,
          },
        }),
      )
    } catch (e) {
    } finally {
      setAllowInviteLoading(false)
    }
  }

  const dropItems = [
    {
      key: "allow_invite",
      label: (
        <AuthShown
          currentUserRole={currentUserRole}
          allowRoles={[USER_ROLE.OWNER, USER_ROLE.ADMIN]}
          rules={SHOW_RULES.EQUAL}
        >
          <div
            css={allowEditorOrViewerInviteWrapperStyle}
            onClick={stopPropagation}
          >
            <span css={moreActionTextStyle}>
              {t("user_management.settings.allow_editors_invite")}
            </span>
            <Switch
              // onClick={stopPropagation}
              onChange={handleChangeInviteByEditor}
              disabled={allowInviteLoading}
              checked={
                allowEditorManageTeamMember && allowViewerManageTeamMember
              }
            />
          </div>
        </AuthShown>
      ),
    },
    {
      key: "leave_team",
      label: (
        <span onClick={handleClickDeleteOrLeaveTeam}>
          {t("team_setting.left_panel.leave")}
        </span>
      ),
      disabled: currentUserRole !== USER_ROLE.OWNER,
    },
  ]

  const menuItems: MenuProps["items"] = dropItems.filter(
    (item) => !item.disabled,
  )

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      onOpenChange={(show: boolean) => {
        if (show) {
          track?.(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
            element: "more",
          })
          track?.(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
            element: "allow_manage",
            parameter2:
              allowEditorManageTeamMember && allowViewerManageTeamMember
                ? "on"
                : "off",
          })
        }
      }}
      menu={{
        items: menuItems,
      }}
    >
      <Button icon={<Icon component={MoreIcon} />} />
    </Dropdown>
  )
}
