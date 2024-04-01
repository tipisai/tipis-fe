import Icon from "@ant-design/icons"
import { App, Button, Dropdown, MenuProps } from "antd"
import { FC, useCallback, useContext, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { AuthShown, SHOW_RULES } from "@illa-public/auth-shown"
import { MoreIcon } from "@illa-public/icon"
import { USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import {
  FREE_TEAM_LIMIT_TYPE,
  handleFreeTeamLimitError,
} from "@illa-public/upgrade-modal"
import {
  useChangeTeamMemberRoleMutation,
  useRemoveTeamMemberByIDMutation,
} from "@illa-public/user-data"
import { isSmallThanTargetRole } from "@illa-public/user-role-utils"
import { MoreActionProps } from "./interface"
import { moreActionWrapper } from "./style"

export const MoreAction: FC<MoreActionProps> = (props) => {
  const {
    currentUserRole,
    userRole,
    userStatus,
    teamMemberID,
    currentUserID,
    name,
    email,
    teamID,
  } = props

  const [removeTeamMember] = useRemoveTeamMemberByIDMutation()
  const [changeTeamMemberRole] = useChangeTeamMemberRoleMutation()

  const { message, modal } = App.useApp()
  const { t } = useTranslation()

  const disabled = useMemo(() => {
    return (
      teamMemberID === currentUserID ||
      isSmallThanTargetRole(userRole, currentUserRole, false)
    )
  }, [teamMemberID, currentUserID, userRole, currentUserRole])

  const handleClickRemoveMember = useCallback(() => {
    modal.confirm({
      title: t("user_management.remove_modal.title", {
        username: name ? name : email,
      }),
      content: t("user_management.remove_modal.description"),
      okText: t("user_management.remove_modal.remove"),
      cancelText: t("user_management.remove_modal.cancel"),
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          removeTeamMember({ teamID, teamMemberID }).unwrap()
          message.success({
            content: t("user_management.mes.remove_suc"),
          })
        } catch (e) {
          message.error({
            content: t("user_management.mes.remove_fail"),
          })
          console.error(e)
        }
      },
      onCancel: () => {},
    })
  }, [email, message, modal, name, removeTeamMember, t, teamID, teamMemberID])

  const handleClickTransOwner = useCallback(() => {
    modal.confirm({
      title: t("user_management.transfer_modal.title"),
      content: t("user_management.transfer_modal.description"),
      okText: t("user_management.transfer_modal.transfer"),
      cancelText: t("user_management.transfer_modal.cancel"),
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await changeTeamMemberRole({
            teamID,
            teamMemberID,
            userRole: USER_ROLE.OWNER,
          }).unwrap()
          message.success({
            content: t("user_management.mes.transfer_suc"),
          })
        } catch (e) {
          const res = handleFreeTeamLimitError(
            e,
            FREE_TEAM_LIMIT_TYPE.TRANSFER_OWNER,
          )
          if (res) return
          message.error({
            content: t("user_management.mes.transfer_fail"),
          })
        }
      },
      onCancel: () => {},
    })
  }, [changeTeamMemberRole, message, modal, t, teamID, teamMemberID])

  const onClickMenuItems: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "transfer": {
        handleClickTransOwner()
        break
      }
      case "remove": {
        handleClickRemoveMember()
        break
      }
    }
  }

  const dropItems = [
    {
      key: "transfer",
      label: (
        <AuthShown
          currentUserRole={currentUserRole}
          allowRoles={[USER_ROLE.OWNER]}
          rules={SHOW_RULES.EQUAL}
        >
          <span>{t("user_management.page.transfer")}</span>
        </AuthShown>
      ),
      disabled:
        currentUserRole !== USER_ROLE.OWNER ||
        userStatus === USER_STATUS.PENDING,
    },
    {
      key: "remove",
      label: (
        <AuthShown
          currentUserRole={currentUserRole}
          allowRoles={[userRole]}
          rules={SHOW_RULES.BIGGER}
        >
          <span>{t("user_management.page.remove")}</span>
        </AuthShown>
      ),
    },
  ]

  return disabled ? null : (
    <div css={moreActionWrapper}>
      <Dropdown
        placement="bottomRight"
        trigger={["click"]}
        onOpenChange={(visible) => {
          if (visible) {
            if (
              currentUserRole === USER_ROLE.OWNER &&
              userStatus !== USER_STATUS.PENDING
            ) {
            }
          }
        }}
        menu={{
          items: dropItems.filter((item) => !item.disabled),
          onClick: onClickMenuItems,
        }}
      >
        <Button
          type="text"
          disabled={disabled}
          icon={<Icon component={MoreIcon} />}
        />
      </Dropdown>
    </div>
  )
}

MoreAction.displayName = "MemberListMoreAction"
