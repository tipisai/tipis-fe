import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Agent } from "@illa-public/public-types"
import { RecordEditor } from "@illa-public/record-editor"
import AIAgentBlock from "../../../../../components/AIAgentBlock"
import { ErrorText } from "../../../../../components/ErrorText"
import { SCROLL_ID } from "../../../../interface"

const VariableEditor: FC = memo(() => {
  const { t } = useTranslation()

  const methods = useFormContext<Agent>()
  const { errors } = useFormState({
    control: methods.control,
  })
  return (
    <Controller
      name="variables"
      control={methods.control}
      rules={{
        validate: (value) => {
          const isValidate = value.every(
            (param) =>
              (param.key === "" && param.value === "") ||
              (param.key !== "" && param.value !== ""),
          )
          return isValidate
            ? isValidate
            : t(
                "Please ensure that both the key and value are either empty or not empty.",
              )
        },
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <AIAgentBlock
          title={t("editor.ai-agent.label.variable")}
          scrollId={SCROLL_ID.VARIABLES}
        >
          <RecordEditor
            records={field.value}
            onAdd={() => {
              field.onChange([
                ...field.value,
                {
                  key: "",
                  value: "",
                },
              ])
            }}
            onChangeKey={(index, key) => {
              const newVariables = [...field.value]
              newVariables[index].key = key
              field.onChange(newVariables)
            }}
            onChangeValue={(index, _, value) => {
              const newVariables = [...field.value]
              newVariables[index].value = value
              field.onChange(newVariables)
            }}
            onDelete={(index) => {
              const newVariables = [...field.value]
              newVariables.splice(index, 1)
              if (newVariables.length === 0) {
                newVariables.push({
                  key: "",
                  value: "",
                })
              }
              field.onChange(newVariables)
            }}
            label={""}
          />
          {errors.variables?.message && (
            <ErrorText errorMessage={errors.variables?.message} />
          )}
        </AIAgentBlock>
      )}
    />
  )
})

VariableEditor.displayName = "VariableEditor"

export default VariableEditor
