import { SubmitHandler } from "react-hook-form"
import { TeamInfo } from "@illa-public/public-types"
import { TeamInfoFields } from "@/page/SettingPage/team/interface"

export interface TeamInfoPCProps {
  loading: boolean
  disabled?: boolean
  onSubmit: SubmitHandler<TeamInfoFields>
  teamInfo?: TeamInfo
  onClickLeaveTeam?: () => void
}
