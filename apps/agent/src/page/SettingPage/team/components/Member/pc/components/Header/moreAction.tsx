import Icon from "@ant-design/icons"
import { App, Button, Dropdown, MenuProps, Switch } from "antd"
import { FC, useCallback, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AuthShown, SHOW_RULES } from "@illa-public/auth-shown"
import { MoreIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getTeamItems,
  teamActions,
  useRemoveTeamMemberByIDMutation,
  useUpdateTeamPermissionConfigMutation,
} from "@illa-public/user-data"
import store from "@/redux/store"
import { removeLocalTeamIdentifier, setLocalTeamIdentifier } from "@/utils/auth"
import { EMPTY_TEAM_PATH, getChatPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import {
  allowEditorOrViewerInviteWrapperStyle,
  moreActionTextStyle,
} from "./style"

export const MoreAction: FC = () => {
  const { message, modal } = App.useApp()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { track } = useContext(MixpanelTrackContext)
  const dispatch = useDispatch()
  const teamInfo = useGetCurrentTeamInfo()!
  const { myRole: currentUserRole, id: currentTeamID } = teamInfo
  const { allowEditorManageTeamMember, allowViewerManageTeamMember } =
    teamInfo.permission

  const [dropDownShow, setDropDownShow] = useState(false)
  const [disableSwitch, setDisableSwitch] = useState(false)

  const [removeTeamMemberByID] = useRemoveTeamMemberByIDMutation()
  const [updateTeamPermissionConfig] = useUpdateTeamPermissionConfigMutation()

  const handleLeaveTeam = useCallback(async () => {
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "leave_modal_leave",
    })
    try {
      removeTeamMemberByID({
        teamID: teamInfo.id,
        teamMemberID: teamInfo?.teamMemberID,
      }).unwrap()
      message.success({
        content: t("team_setting.mes.leave_suc"),
      })
      track?.(ILLA_MIXPANEL_EVENT_TYPE.REQUEST, {
        element: "delete",
        parameter1: "delete_select",
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
      message.error({
        content: t("team_setting.mes.leave_fail"),
      })
    }
  }, [
    dispatch,
    message,
    navigate,
    removeTeamMemberByID,
    t,
    teamInfo.id,
    teamInfo?.teamMemberID,
    track,
  ])

  const handleClickDeleteOrLeaveTeam = useCallback(() => {
    modal.confirm({
      title: t("team_setting.leave_modal.title"),
      content: t("team_setting.leave_modal.description"),
      okText: t("team_setting.leave_modal.leave"),
      cancelText: t("team_setting.leave_modal.cancel"),
      okButtonProps: {
        danger: true,
      },
      onOk: handleLeaveTeam,
      onCancel: () => {
        track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
          element: "leave_modal_cancel",
        })
      },
    })
  }, [handleLeaveTeam, modal, t, track])

  const handleChangeInviteByEditor = async (value: boolean) => {
    try {
      setDisableSwitch(true)
      await updateTeamPermissionConfig({
        teamID: currentTeamID,
        data: {
          allowEditorManageTeamMember: value,
          allowViewerManageTeamMember: value,
        },
      })
    } catch (e) {
    } finally {
      setDisableSwitch(false)
    }
  }

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "allow_invite":
        handleChangeInviteByEditor(
          !(allowEditorManageTeamMember && allowViewerManageTeamMember),
        )
        break
      case "leave_team":
        handleClickDeleteOrLeaveTeam()
        setDropDownShow(false)
        break
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
          <div css={allowEditorOrViewerInviteWrapperStyle}>
            <span css={moreActionTextStyle}>
              {t("user_management.settings.allow_editors_invite")}
            </span>
            <Switch
              disabled={disableSwitch}
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
      label: t("team_setting.left_panel.leave"),
      disabled: currentUserRole === USER_ROLE.OWNER,
    },
  ]

  const menuItems: MenuProps["items"] = dropItems.filter(
    (item) => !item.disabled,
  )

  return (
    <Dropdown
      trigger={["click"]}
      open={dropDownShow}
      placement="bottomRight"
      onOpenChange={(show: boolean, { source }) => {
        source !== "menu" && setDropDownShow(show)
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
        onClick: handleMenuClick,
      }}
    >
      <Button
        size="large"
        icon={<Icon component={MoreIcon} />}
        onClick={() => setDropDownShow(!dropDownShow)}
      />
    </Dropdown>
  )
}
