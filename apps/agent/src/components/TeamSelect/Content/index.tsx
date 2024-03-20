import Icon from "@ant-design/icons"
import { Avatar, Divider, Tag } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { SuccessIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import {
  getCurrentTeamInfo,
  getTeamItems,
  teamActions,
} from "@illa-public/user-data"
import { isSubscribeForBilling } from "@/utils/billing/isSubscribe"
import { TeamSelectProps } from "../interface"
import { containerStyle, switchItemStyle, teamInfoStyle } from "./style"

interface TeamSelectContentProps extends TeamSelectProps {
  closePopover: () => void
}

const TeamSelectContent: FC<TeamSelectContentProps> = (props) => {
  const { closePopover, openCreateModal, showCreateTeamButton } = props
  const { t } = useTranslation()
  const teamInfo = useSelector(getCurrentTeamInfo)!
  const { track } = useContext(MixpanelTrackContext)

  const { pathname } = useLocation()
  const { teamIdentifier } = useParams()
  const navigate = useNavigate()

  const currentTeamId = teamInfo?.id
  const teamItems = useSelector(getTeamItems)
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
    const currentTeamInfo = teamItems?.find(
      (item) => item.identifier === currentIdentifier,
    )
    if (currentTeamInfo) {
      let toURL
      if (teamIdentifier) {
        toURL = pathname.replace(teamIdentifier, currentIdentifier)
      } else {
        toURL = `/setting/${currentIdentifier}/team-settings`
      }
      dispatch(teamActions.updateCurrentIdReducer(currentId))
      dispatch(teamActions.updateCurrentTeamInfoReducer(currentTeamInfo))
      navigate(toURL, { replace: true })
      closePopover()
    }
  }

  return (
    <div css={containerStyle}>
      {teamItems?.map((item, index) => {
        const isCurrent = currentTeamId === item.id
        const isFree = isSubscribeForBilling(item.woo?.plan)
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
