import { Input } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Agent } from "@illa-public/public-types"
import AIAgentBlock from "../../../../../components/AIAgentBlock"
import { ErrorText } from "../../../../../components/ErrorText"

const NameEditor: FC = memo(() => {
  const { t } = useTranslation()

  const methods = useFormContext<Agent>()

  const { errors } = useFormState({
    control: methods.control,
  })

  return (
    <Controller
      name="name"
      control={methods.control}
      rules={{
        required: t("editor.ai-agent.validation_blank.name"),
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <AIAgentBlock title={t("editor.ai-agent.label.name")} required>
          <Input
            {...field}
            placeholder={t("editor.ai-agent.placeholder.name")}
            status={!!errors.name ? "error" : undefined}
            maxLength={60}
            onChange={(e) => {
              const value = e.target.value
              field.onChange(value)
              // setInRoomUsers(updateLocalName(value, inRoomUsers))
            }}
          />
          {errors.name?.message && (
            <ErrorText errorMessage={errors.name?.message} />
          )}
        </AIAgentBlock>
      )}
    />
  )
})

NameEditor.displayName = "NameEditor"

export default NameEditor
