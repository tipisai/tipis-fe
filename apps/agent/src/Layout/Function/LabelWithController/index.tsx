import { FC } from "react"
import ErrorMessage from "../../../components/InputErrorMessage"
import Label from "../Label"
import { ILabelWithControllerProps } from "./interface"
import {
  controllerContainerStyle,
  errorMessageContainerStyle,
  labelWithContainerStyle,
  outerContainerStyle,
} from "./style"

const LabelWithController: FC<ILabelWithControllerProps> = (props) => {
  const { title, children, required, errorMessage } = props
  return (
    <div css={outerContainerStyle}>
      <div css={labelWithContainerStyle}>
        <Label title={title} required={required} />
        <div css={controllerContainerStyle}>{children}</div>
      </div>
      {errorMessage && (
        <div css={errorMessageContainerStyle}>
          <Label title={""} />
          <ErrorMessage message={errorMessage} />
        </div>
      )}
    </div>
  )
}

export default LabelWithController
