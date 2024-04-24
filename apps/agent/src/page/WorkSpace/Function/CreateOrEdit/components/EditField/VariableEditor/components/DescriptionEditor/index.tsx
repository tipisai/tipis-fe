import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "@/page/WorkSpace/Function/CreateOrEdit/interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const DescriptionEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()
  const { t } = useTranslation()

  return (
    <Controller
      name={`config.variables.${index}.description`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.description")}
          >
            <Input.TextArea
              maxLength={160}
              placeholder={t(
                "function.edit.variable_modal.placeholder.description",
              )}
              rows={5}
              autoSize={{ minRows: 5, maxRows: 5 }}
              {...field}
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default DescriptionEditor
