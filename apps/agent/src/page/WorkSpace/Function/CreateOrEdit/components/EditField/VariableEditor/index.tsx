import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IBaseFunctionForm } from "../../../interface"
import VariableModalContent from "./components/VariableContent"
import VariableList from "./components/VariableList"
import { tipisContainerStyle, tipisOuterContainerStyle } from "./style"

const VariableEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IBaseFunctionForm>()
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <Controller
        name="config.variables"
        control={control}
        shouldUnregister={false}
        render={({ field }) => {
          const hasVariable = field.value.length > 0
          return (
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
              {!hasVariable && (
                <Button
                  icon={<Icon component={PlusIcon} />}
                  block
                  size="large"
                  onClick={() => {
                    field.onChange([
                      {
                        name: "",
                        type: "string",
                        testValue: "",
                        required: true,
                        enumValues: [],
                      },
                    ])
                    setShowCreateModal(true)
                  }}
                >
                  {t("editor.action.panel.btn.new")}
                </Button>
              )}
              {hasVariable && <VariableList />}

              <VariableModalContent
                index={0}
                open={showCreateModal}
                openChange={setShowCreateModal}
              />
            </LayoutBlock>
          )
        }}
      />
    </>
  )
})

VariableEditor.displayName = "VariableEditor"

export default VariableEditor
