import { Input } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IFunctionInterface } from "@illa-public/public-types"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Function/LayoutBlock"

const NameEditor: FC = memo(() => {
  const { t } = useTranslation()

  const methods = useFormContext<IFunctionInterface>()

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
      render={({ field, fieldState }) => (
        <LayoutBlock title={t("editor.ai-agent.label.name")} required>
          <Input
            {...field}
            size="large"
            placeholder={t("editor.ai-agent.placeholder.name")}
            status={!!fieldState.error?.message ? "error" : undefined}
            maxLength={60}
            onChange={(e) => {
              const value = e.target.value
              field.onChange(value)
              // setInRoomUsers(updateLocalName(value, inRoomUsers))
            }}
          />
          <ErrorText message={fieldState.error?.message} />
        </LayoutBlock>
      )}
    />
  )
})

NameEditor.displayName = "NameEditor"

export default NameEditor
