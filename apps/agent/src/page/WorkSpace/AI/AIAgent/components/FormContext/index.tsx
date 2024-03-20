import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { IAgentForm } from "../../interface"
import { useSubmitSaveAgent } from "../../utils"
import { IFormContextProps } from "./interface"
import { formStyle } from "./style"

const FormContext: FC<IFormContextProps> = (props) => {
  const { children } = props
  const { handleSubmit } = useFormContext<IAgentForm>()
  const handleSubmitSave = useSubmitSaveAgent()

  return (
    <form onSubmit={handleSubmit(handleSubmitSave)} css={formStyle}>
      {children}
    </form>
  )
}

export default FormContext
