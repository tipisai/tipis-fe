import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import LayoutBlock from "@/Layout/Form/LayoutBlock"

const VariableEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext()
  const { errors } = useFormState({
    control: control,
  })

  return (
    <Controller
      name="variable"
      control={control}
      rules={{
        required: t("editor.ai-agent.validation_blank.description"),
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          title={t("editor.ai-agent.label.desc")}
          subtitleTips={t("editor.ai-agent.generate-desc.tooltips")}
          required
          // errorMessage={errors.description?.message}
        >
          <Button icon={<Icon component={PlusIcon} />} block size="large">
            {t("editor.action.panel.btn.new")}
          </Button>
        </LayoutBlock>
      )}
    />
  )
})

VariableEditor.displayName = "VariableEditor"

export default VariableEditor
