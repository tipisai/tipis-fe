import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LayoutBlock from "@/Layout/Function/LayoutBlock"
import { IFunctionForm } from "../../../interface"
import CreateVariableButton from "./components/CreateVariableButton"
import NewVariableList from "./components/NewVariableList"

const VariableEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IFunctionForm>()

  return (
    <>
      <Controller
        name="parameters"
        control={control}
        shouldUnregister={false}
        render={({ field }) => {
          const hasVariable = field.value.length > 0
          return (
            <LayoutBlock
              title={t("function.edit.configure.label.variable")}
              description={t("function.edit.configure.tips.variable")}
            >
              <CreateVariableButton
                buttonProps={{
                  size: "large",
                  block: true,
                  hiddenButton: hasVariable,
                }}
                addedIndex={field.value.length}
              />
              {hasVariable && <NewVariableList />}
            </LayoutBlock>
          )
        }}
      />
    </>
  )
})

VariableEditor.displayName = "VariableEditor"

export default VariableEditor
