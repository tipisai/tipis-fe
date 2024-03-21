import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { IAIFunctionResource } from "@illa-public/public-types"
import { IFormContextProps } from "./interface"
import { formStyle } from "./style"

const FormContext: FC<IFormContextProps> = (props) => {
  const { children } = props
  const { handleSubmit } = useFormContext<IAIFunctionResource>()

  return (
    <form onSubmit={handleSubmit(() => {})} css={formStyle}>
      {children}
    </form>
  )
}

export default FormContext
