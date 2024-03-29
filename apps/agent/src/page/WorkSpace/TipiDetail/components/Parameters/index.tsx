import { FC } from "react"
import { useTranslation } from "react-i18next"
import { RecordEditor } from "@illa-public/record-editor"
import { IParameterProps } from "./interface"
import { ParametersContainerStyle, labelStyle } from "./style"

const Parameters: FC<IParameterProps> = (props) => {
  const { t } = useTranslation()
  return (
    <div css={ParametersContainerStyle}>
      <p css={labelStyle}>{t("editor.ai-agent.label.variable")}</p>
      <RecordEditor records={props.parameters} label="" readOnly />
    </div>
  )
}

Parameters.displayName = "Parameters"
export default Parameters
