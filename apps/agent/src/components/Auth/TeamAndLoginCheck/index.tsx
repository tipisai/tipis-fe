import { FC } from "react"
import { BaseProtectComponentProps } from "@/router/interface"
import AuthCheck from "../AuthCheck"
import TeamCheck from "../TeamCheck"

const TeamAndLoginCheck: FC<BaseProtectComponentProps> = (props) => {
  const { children, needRole } = props

  return (
    <AuthCheck>
      <TeamCheck needRole={needRole}>{children}</TeamCheck>
    </AuthCheck>
  )
}

export default TeamAndLoginCheck
