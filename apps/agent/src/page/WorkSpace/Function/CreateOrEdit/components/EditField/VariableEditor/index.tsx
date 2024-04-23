import Icon from "@ant-design/icons"
import { Button, Modal } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IBaseFunctionForm } from "../../../interface"
import VariableContent from "./components/VariableContent"
import {
  customModalStyle,
  tipisContainerStyle,
  tipisOuterContainerStyle,
} from "./style"

const VariableEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IBaseFunctionForm>()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const variables = useWatch({
    control,
    name: "config.variables",
  })

  const hasVariable = variables.length > 0

  console.log("hasVariable", hasVariable)

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
                        required: false,
                        enumValues: [],
                      },
                    ])
                    setShowCreateModal(true)
                  }}
                >
                  {t("editor.action.panel.btn.new")}
                </Button>
              )}
              {hasVariable && <div>List</div>}

              <Modal
                open={showCreateModal}
                title="Configure Variable"
                css={customModalStyle}
                footer={false}
              >
                <VariableContent index={0} />
              </Modal>
            </LayoutBlock>
          )
        }}
      />
    </>
  )
})

VariableEditor.displayName = "VariableEditor"

export default VariableEditor
