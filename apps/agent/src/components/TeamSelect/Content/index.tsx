import Icon from "@ant-design/icons"
import { Avatar, Divider, Tag } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { SuccessIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { teamActions, useGetTeamsInfoQuery } from "@illa-public/user-data"
import { setLocalTeamIdentifier } from "@/utils/auth"
import { isSubscribeForBilling } from "@/utils/billing/isSubscribe"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { TeamSelectProps } from "../interface"
import { containerStyle, switchItemStyle, teamInfoStyle } from "./style"

interface TeamSelectContentProps extends TeamSelectProps {
  closePopover: () => void
}

const TeamSelectContent: FC<TeamSelectContentProps> = (props) => {
  const { closePopover, openCreateModal, showCreateTeamButton, onChangeTeam } =
    props
  const { t } = useTranslation()
  const teamInfo = useGetCurrentTeamInfo()!
  const { track } = useContext(MixpanelTrackContext)

  const currentTeamId = teamInfo?.id
  const { data } = useGetTeamsInfoQuery(null)
  const teamItems = data ?? []
  const dispatch = useDispatch()

  const handleClickCreateTeam = () => {
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "create_team",
      parameter2: "homepage_select",
      parameter3: teamItems?.length,
    })
    openCreateModal?.()
    closePopover()
  }

  const switchCurrentTeam = (currentId: string, currentIdentifier: string) => {
    onChangeTeam?.(currentId, currentIdentifier)
    setLocalTeamIdentifier(currentIdentifier)
    dispatch(teamActions.updateCurrentIdReducer(currentId))
    closePopover()
  }

  return (
    <div css={containerStyle}>
      {teamItems?.map((item, index) => {
        const isCurrent = currentTeamId === item.id
        const isFree = !isSubscribeForBilling(item.credit?.plan)
        return (
          <div
            css={switchItemStyle}
            key={index}
            onClick={() => {
              track?.(
                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                { element: "change_team" },
                "userRole",
              )
              switchCurrentTeam(item.id, item.identifier)
            }}
          >
            <div css={teamInfoStyle}>
              <Avatar src={item.icon} size={24} shape="square" />
              <span>{item.name}</span>
              {isFree && (
                <Tag color="purple">
                  {t("billing.subscription_general.plan.free")}
                </Tag>
              )}
            </div>
            {isCurrent && <Icon component={SuccessIcon} />}
          </div>
        )
      })}
      {showCreateTeamButton && (
        <>
          <Divider
            style={{
              margin: "8px 0",
            }}
          />
          <div css={switchItemStyle} onClick={handleClickCreateTeam}>
            {t("page.workspace.menu.create_team")}
          </div>
        </>
      )}
    </div>
  )
}
export default TeamSelectContent
