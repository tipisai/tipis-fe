import { Input } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IBaseFunctionForm } from "../../../interface"

const NameEditor: FC = memo(() => {
  const { t } = useTranslation()

  const methods = useFormContext<IBaseFunctionForm>()

  const { errors } = useFormState({
    control: methods.control,
  })

  return (
    <Controller
      name="name"
      control={methods.control}
      rules={{
        required: t("function.edit.configure.name.empty"),
        maxLength: 64,
        pattern: {
          value: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
          message: t("function.edit.configure.name.validate"),
        },
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          title={t("editor.ai-agent.label.name")}
          required
          // errorMessage={
          //   errors.name?.message ?? t("function.edit.configure.name.validate")
          // }
        >
          <Input
            {...field}
            size="large"
            placeholder={t("editor.ai-agent.placeholder.name")}
            status={!!errors.name ? "error" : undefined}
            maxLength={60}
            onChange={(e) => {
              const value = e.target.value
              field.onChange(value)
              // setInRoomUsers(updateLocalName(value, inRoomUsers))
            }}
          />
        </LayoutBlock>
      )}
    />
  )
})

NameEditor.displayName = "NameEditor"

export default NameEditor
