import { FC } from "react"
import { BaseProtectComponentProps } from "@/router/interface"
import LoginAuth from "../LoginAuth"
import TeamCheck from "../TeamCheck"

const TeamAndLoginCheck: FC<BaseProtectComponentProps> = (props) => {
  const { children, needRole } = props

  return (
    <LoginAuth>
      <TeamCheck needRole={needRole}>{children}</TeamCheck>
    </LoginAuth>
  )
}

export default TeamAndLoginCheck
