import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { tipisContainerStyle, tipisOuterContainerStyle } from "./style"

const VariableEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <>
      <Controller
        name="variable"
        control={control}
        shouldUnregister={false}
        render={() => (
          <LayoutBlock
            title={t("function.edit.configure.label.variable")}
            required
            // errorMessage={errors.description?.message}
          >
            <div css={tipisOuterContainerStyle}>
              <div css={tipisContainerStyle}>
                {t("function.edit.configure.tips.variable")}
              </div>
            </div>
            <Button icon={<Icon component={PlusIcon} />} block size="large">
              {t("editor.action.panel.btn.new")}
            </Button>
          </LayoutBlock>
        )}
      />
    </>
  )
})

VariableEditor.displayName = "VariableEditor"

export default VariableEditor
