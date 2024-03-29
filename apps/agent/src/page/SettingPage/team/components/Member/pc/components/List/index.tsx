import { GetProp, Table, TableProps } from "antd"
import { FC, useContext, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { MemberInfo, USER_ROLE } from "@illa-public/public-types"
import { RoleSelector } from "@illa-public/role-selector"
import { useGetMemberListQuery } from "@illa-public/user-data"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { MemberContext } from "../../../context"
import { MoreAction } from "../MoreAction"
import { NameSpace } from "../NameSpace"
import { tableListContainerStyle } from "./style"

export const PCMemberList: FC = () => {
  const teamInfo = useGetCurrentTeamInfo()!
  const { teamMemberID, myRole, id: currentTeamID } = teamInfo
  const { data: memberList } = useGetMemberListQuery(currentTeamID)
  const { t } = useTranslation()
  const { handleChangeTeamMembersRole } = useContext(MemberContext)

  const tableColumns: GetProp<TableProps<MemberInfo>, "columns"> = useMemo(
    () => [
      {
        dataIndex: "userInfo",
        title: t("user_management.page.member"),
        size: 520,
        sorter: true,
        render: (_, value: MemberInfo) => {
          return (
            <NameSpace
              key={value?.userID}
              name={value?.nickname}
              avatar={value?.avatar}
              email={value?.email}
              status={value?.userStatus}
              userID={value?.userID}
              teamMemberID={value?.teamMemberID}
              currentUserID={teamMemberID}
            />
          )
        },
      },
      {
        title: t("user_management.page.permission"),
        dataIndex: "permissions",
        render: (_, value: MemberInfo) => {
          const executedUserRole =
            value.userRole !== USER_ROLE.OWNER ? [USER_ROLE.OWNER] : []
          return (
            <RoleSelector
              key={value.teamMemberID}
              value={value.userRole}
              currentUserRole={myRole}
              onClickItem={(userRole: USER_ROLE) => {
                handleChangeTeamMembersRole(value.teamMemberID, userRole)
              }}
              isSelf={value.teamMemberID === teamMemberID}
              excludeUserRole={executedUserRole}
            />
          )
        },
      },
      {
        dataIndex: "actions",
        title: " ",
        size: 32,
        enableSorting: false,
        render: (_, value: MemberInfo) => {
          return (
            <MoreAction
              key={value.email}
              email={value.email}
              userRole={value.userRole}
              userStatus={value.userStatus}
              currentUserRole={myRole}
              currentUserID={teamMemberID}
              teamMemberID={value.teamMemberID}
              name={value.nickname}
              teamID={currentTeamID}
            />
          )
        },
      },
    ],
    [currentTeamID, handleChangeTeamMembersRole, myRole, t, teamMemberID],
  )

  return (
    <div css={tableListContainerStyle}>
      <Table
        dataSource={memberList}
        columns={tableColumns}
        pagination={false}
        rowKey={(record) => record.userID}
      />
    </div>
  )
}
