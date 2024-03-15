import { SubmitHandler } from "react-hook-form"
import { TeamInfoFields } from "@/page/SettingPage/team/interface"

export interface TeamInfoMobileProps {
  loading: boolean
  disabled?: boolean
  onSubmit: SubmitHandler<TeamInfoFields>
}
