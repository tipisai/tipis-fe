import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { IFormContextProps } from "./interface"
import { formStyle } from "./style"

const FormContext: FC<IFormContextProps> = (props) => {
  const { children } = props
  const { handleSubmit } = useFormContext()

  return (
    <form onSubmit={handleSubmit((_data) => {})} css={formStyle}>
      {children}
    </form>
  )
}

export default FormContext
