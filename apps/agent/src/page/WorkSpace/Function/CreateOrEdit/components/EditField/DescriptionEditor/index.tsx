import { Input } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IFunctionInterface } from "@illa-public/public-types"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Function/LayoutBlock"

const DescriptionEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IFunctionInterface>()

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
        <LayoutBlock title={t("editor.ai-agent.label.desc")} required>
          <Input.TextArea
            {...field}
            size="large"
            status={!!fieldState.error?.message ? "error" : undefined}
            maxLength={160}
            placeholder={t("editor.ai-agent.placeholder.desc")}
            autoSize={{
              minRows: 1,
              maxRows: 5,
            }}
          />
          <ErrorText message={fieldState.error?.message} />
        </LayoutBlock>
      )}
    />
  )
})

DescriptionEditor.displayName = "DescriptionEditor"

export default DescriptionEditor
