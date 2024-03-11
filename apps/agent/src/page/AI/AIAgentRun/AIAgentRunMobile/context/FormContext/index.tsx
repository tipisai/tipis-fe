import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { Agent } from "@illa-public/public-types"
import { useReRerunAgent } from "../../../AIAgentRunPC/utils"
import { IFormContextProps } from "./interface"
import { formStyle } from "./style"

const FormContext: FC<IFormContextProps> = (props) => {
  const { children } = props
  const { handleSubmit } = useFormContext<Agent>()
  const handleReRunAgent = useReRerunAgent()

  return (
    <form onSubmit={handleSubmit(handleReRunAgent)} css={formStyle}>
      {children}
    </form>
  )
}

export default FormContext
