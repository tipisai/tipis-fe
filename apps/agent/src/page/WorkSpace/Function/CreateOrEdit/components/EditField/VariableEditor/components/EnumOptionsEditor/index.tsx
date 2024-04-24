import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CloseIcon, PlusIcon } from "@illa-public/icon"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "@/page/WorkSpace/Function/CreateOrEdit/interface"
import { IBaseVariableItemEditorProps } from "../../interface"
import {
  deleteIconStyle,
  enumOptionItemContainerStyle,
  enumOptionsEditorContainerStyle,
  subTitleStyle,
} from "./style"

const EnumOptionsEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  const { t } = useTranslation()

  return (
    <Controller
      name={`config.variables.${index}.enumValues`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController title="">
            <div css={enumOptionsEditorContainerStyle}>
              <p css={subTitleStyle}>
                {t("function.edit.variable_modal.label.options")}
              </p>
              {field.value.map((value, valueIndex) => (
                <div key={valueIndex} css={enumOptionItemContainerStyle}>
                  <Input
                    value={value}
                    onChange={(e) => {
                      const newValue = e.target.value
                      field.onChange(
                        field.value.map((v, i) =>
                          i === valueIndex ? newValue : v,
                        ),
                      )
                    }}
                  />
                  <Button
                    css={deleteIconStyle}
                    type="text"
                    onClick={() => {
                      field.onChange(
                        field.value.filter((_, i) => i !== valueIndex),
                      )
                    }}
                    icon={<Icon component={CloseIcon} />}
                  />
                </div>
              ))}
              <div>
                <Button
                  type="text"
                  onClick={() => {
                    field.onChange([...field.value, ""])
                  }}
                  icon={<Icon component={PlusIcon} />}
                >
                  {t("editor.action.panel.btn.new")}
                </Button>
              </div>
            </div>
          </LabelWithController>
        )
      }}
    />
  )
}

export default EnumOptionsEditor
