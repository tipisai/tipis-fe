import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { Agent } from "@illa-public/public-types"
import { useSubmitSaveAgent } from "../../utils"
import { IFormContextProps } from "./interface"
import { formStyle } from "./style"

const FormContext: FC<IFormContextProps> = (props) => {
  const { children } = props
  const { handleSubmit } = useFormContext<Agent>()
  const handleSubmitSave = useSubmitSaveAgent()

  return (
    <form onSubmit={handleSubmit(handleSubmitSave)} css={formStyle}>
      {children}
    </form>
  )
}

export default FormContext
