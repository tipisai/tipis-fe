import { AUTH_STEP } from "@/page/UserAuth/AuthPage/interface"

export interface IEmailAuthProps {
  setAuthStep: (authStep: AUTH_STEP) => void
}
