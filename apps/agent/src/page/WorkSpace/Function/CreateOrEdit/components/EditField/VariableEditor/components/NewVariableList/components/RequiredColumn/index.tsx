import { FC } from "react"
import { useTranslation } from "react-i18next"
import { ErrorIcon, SuccessIcon } from "@illa-public/icon"
import HeaderField from "../HeaderField"
import { IRequiredColumnProps } from "./interface"
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

const RequiredColumn: FC<IRequiredColumnProps> = (props) => {
  const { requireds = [] } = props
  const { t } = useTranslation()
  return (
    <div css={descriptionContainerStyle}>
      <HeaderField title={t("function.edit.variable_modal.label.required")} />
      {requireds.map((req, i) => (
        <div key={i} css={listItemContainerStyle}>
          {getRequiredIcon(req)}
        </div>
      ))}
    </div>
  )
}

export default RequiredColumn
