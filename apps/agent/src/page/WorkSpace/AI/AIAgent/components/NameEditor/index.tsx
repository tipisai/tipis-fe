import { Input } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Agent } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { SCROLL_ID } from "../../interface"

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
        <LayoutBlock
          title={t("editor.ai-agent.label.name")}
          required
          scrollId={SCROLL_ID.NAME}
          errorMessage={errors.name?.message}
        >
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
        </LayoutBlock>
      )}
    />
  )
})

NameEditor.displayName = "NameEditor"

export default NameEditor
