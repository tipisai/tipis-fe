import { SubmitHandler } from "react-hook-form"
import { ITeamInfoVO } from "@illa-public/public-types"
import { TeamInfoFields } from "@/page/SettingPage/team/interface"

export interface TeamInfoPCProps {
  loading: boolean
  disabled?: boolean
  onSubmit: SubmitHandler<TeamInfoFields>
  teamInfo?: ITeamInfoVO
}
