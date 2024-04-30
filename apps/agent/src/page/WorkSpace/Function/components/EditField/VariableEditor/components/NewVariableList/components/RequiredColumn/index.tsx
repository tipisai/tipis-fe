import { FC } from "react"
import { useTranslation } from "react-i18next"
import { ErrorIcon, SuccessIcon } from "@illa-public/icon"
import { useVariableToCompletionOption } from "@/utils/function/hook"
import HeaderField from "../HeaderField"
import {
  descriptionContainerStyle,
  errorIconStyle,
  listItemContainerStyle,
  successIconStyle,
} from "./style"

const getRequiredIcon = (required: boolean) => {
  return required ? (
    <SuccessIcon css={successIconStyle} />
  ) : (
    <ErrorIcon css={errorIconStyle} />
  )
}

const RequiredColumn: FC = () => {
  const options = useVariableToCompletionOption()

  const { t } = useTranslation()
  return (
    <div css={descriptionContainerStyle}>
      <HeaderField title={t("function.edit.variable_modal.label.required")} />
      {options.map((item, i) => (
        <div key={i} css={listItemContainerStyle}>
          {getRequiredIcon(!!item.required)}
        </div>
      ))}
    </div>
  )
}

export default RequiredColumn
