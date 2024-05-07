import { Input } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IAgentForm, SCROLL_ID } from "../../interface"

const DescriptionEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IAgentForm>()

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
      render={({ field, fieldState }) => (
        <LayoutBlock
          scrollId={SCROLL_ID.DESCRIPTION}
          title={t("editor.ai-agent.label.desc")}
          required
          errorMessage={fieldState.error?.message}
        >
          <Input.TextArea
            {...field}
            status={!!fieldState.error?.message ? "error" : undefined}
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
