import Icon from "@ant-design/icons"
import { App, Button, Dropdown, MenuProps } from "antd"
import { FC, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MoreIcon } from "@illa-public/icon"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getTeamItems,
  teamActions,
  useRemoveTeamMemberByIDMutation,
} from "@illa-public/user-data"
import store from "@/redux/store"
import { EMPTY_TEAM_PATH } from "@/router/constants"
import { getChatPath } from "@/utils/routeHelper"
import {
  removeLocalTeamIdentifier,
  setLocalTeamIdentifier,
} from "@/utils/storage/cacheTeam"
import { useGetCurrentTeamInfo } from "@/utils/team"

export const MoreAction: FC = () => {
  const { message, modal } = App.useApp()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const teamInfo = useGetCurrentTeamInfo()!
  const { myRole: currentUserRole } = teamInfo

  const [dropDownShow, setDropDownShow] = useState(false)

  const [removeTeamMemberByID] = useRemoveTeamMemberByIDMutation()

  const handleLeaveTeam = useCallback(async () => {
    try {
      removeTeamMemberByID({
        teamID: teamInfo.id,
        teamMemberID: teamInfo?.teamMemberID,
      }).unwrap()
      message.success({
        content: t("team_setting.mes.leave_suc"),
      })

      const teamItems = getTeamItems(store.getState()) ?? []
      const newTeamItems = teamItems.filter((team) => team.id !== teamInfo.id)
      if (Array.isArray(newTeamItems) && newTeamItems.length > 0) {
        setLocalTeamIdentifier(newTeamItems[0].identify)
        dispatch(teamActions.updateCurrentIdReducer(newTeamItems[0].id))
        navigate(getChatPath(newTeamItems[0].identify), {
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
      onCancel: () => {},
    })
  }, [handleLeaveTeam, modal, t])

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "leave_team":
        handleClickDeleteOrLeaveTeam()
        setDropDownShow(false)
        break
    }
  }

  const dropItems = [
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
