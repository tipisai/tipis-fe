import { Input } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LayoutBlock from "@/Layout/Form/LayoutBlock"

const DescriptionEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext()
  const { errors } = useFormState({
    control: control,
  })

  return (
    <Controller
      name="description"
      control={control}
      rules={{
        required: t("editor.ai-agent.validation_blank.description"),
        maxLength: {
          value: 160,
          message: t("editor.ai-agent.length_invalid.description"),
        },
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          title={t("editor.ai-agent.label.desc")}
          subtitleTips={t("editor.ai-agent.generate-desc.tooltips")}
          required
          // errorMessage={errors.description?.message}
        >
          <Input.TextArea
            {...field}
            status={!!errors.description ? "error" : undefined}
            maxLength={160}
            placeholder={t("editor.ai-agent.placeholder.desc")}
            autoSize={{
              minRows: 1,
              maxRows: 5,
            }}
          />
        </LayoutBlock>
      )}
    />
  )
})

DescriptionEditor.displayName = "DescriptionEditor"

export default DescriptionEditor
