import { SubmitHandler } from "react-hook-form"
import {
  TeamSettingErrorMsg,
  TeamSettingFields,
} from "@/page/SettingPage/team/interface"

export interface MobileSettingProps {
  loading: boolean
  disabled?: boolean
  errorMsg: TeamSettingErrorMsg
  onSubmit: SubmitHandler<TeamSettingFields>
}
