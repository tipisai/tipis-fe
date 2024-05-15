import Icon from "@ant-design/icons"
import { Avatar, Divider } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { SuccessIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { teamActions, useGetTeamsInfoQuery } from "@illa-public/user-data"
import { createTeamContext } from "@/Layout/Workspace/context"
import { setLocalTeamIdentifier } from "@/utils/storage/cacheTeam"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { TeamSelectProps } from "../interface"
import { containerStyle, switchItemStyle, teamInfoStyle } from "./style"

interface TeamSelectContentProps extends TeamSelectProps {
  closePopover: () => void
}

const TeamSelectContent: FC<TeamSelectContentProps> = (props) => {
  const { closePopover, showCreateTeamButton, onChangeTeam } = props
  const { t } = useTranslation()
  const teamInfo = useGetCurrentTeamInfo()!

  const { onChangeTeamVisible } = useContext(createTeamContext)

  const currentTeamId = teamInfo?.id
  const { data } = useGetTeamsInfoQuery(null)
  const teamItems = data ?? []
  const dispatch = useDispatch()

  const handleClickCreateTeam = () => {
    onChangeTeamVisible?.(true)
    TipisTrack.track("click_create_team_entry", {
      parameter1: "team_selector",
    })
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
        return (
          <div
            css={switchItemStyle}
            key={index}
            onClick={() => {
              switchCurrentTeam(item.id, item.identify)
            }}
          >
            <div css={teamInfoStyle}>
              <Avatar src={item.avatarUrl} size={24} shape="square" />
              <span>{item.name}</span>
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
