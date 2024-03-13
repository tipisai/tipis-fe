import { SubmitHandler } from "react-hook-form"
import { TeamInfo } from "@illa-public/public-types"
import {
  TeamSettingErrorMsg,
  TeamSettingFields,
} from "@/page/SettingPage/team/interface"

export interface SettingProps {
  loading: boolean
  disabled?: boolean
  errorMsg: TeamSettingErrorMsg
  onSubmit: SubmitHandler<TeamSettingFields>
  teamInfo?: TeamInfo
  onClickLeaveTeam?: () => void
}
