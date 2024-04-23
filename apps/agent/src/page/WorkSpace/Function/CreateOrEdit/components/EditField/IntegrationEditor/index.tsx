import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import LayoutBlock from "@/Layout/Form/LayoutBlock"

const IntegrationEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <Controller
      name="integration"
      control={control}
      rules={{
        required: t("function.edit.configure.label.integration"),
      }}
      shouldUnregister={false}
      render={() => (
        <LayoutBlock
          title={t("function.edit.configure.label.integration")}
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

IntegrationEditor.displayName = "IntegrationEditor"

export default IntegrationEditor
