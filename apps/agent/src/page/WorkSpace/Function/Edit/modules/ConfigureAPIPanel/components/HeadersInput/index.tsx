import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IAIFunctionResource } from "@illa-public/public-types"
import ColumnLayoutContainer from "@/Layout/AIFunction/FormLayoutContainer/columnLayoutContainer"
import { RecordEditor } from "@/components/CodeMirrorRecordEditor"

const HeadersInput: FC = () => {
  const { t } = useTranslation()

  const methods = useFormContext<IAIFunctionResource>()

  return (
    <Controller
      name="content.headers"
      control={methods.control}
      rules={{
        required: t("editor.ai-agent.validation_blank.name"),
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <ColumnLayoutContainer
          labelName={t("editor.action.resource.restapi.label.headers")}
        >
          <RecordEditor
            records={field.value}
            completionOptions={{}}
            onAdd={() => {
              const newHeaders = [...field.value].concat({
                key: "",
                value: "",
              })
              field.onChange(newHeaders)
            }}
            onChangeKey={(index, key) => {
              const newURLParams = [...field.value]
              newURLParams[index] = {
                ...newURLParams[index],
                key: key,
              }
              field.onChange(newURLParams)
            }}
            onChangeValue={(index, _, value) => {
              const newURLParams = [...field.value]
              newURLParams[index] = {
                ...newURLParams[index],
                value: value,
              }
              field.onChange(newURLParams)
            }}
            onDelete={(index) => {
              const newURLParams = [...field.value].filter(
                (_, i) => i !== index,
              )
              field.onChange(newURLParams)
            }}
            label={""}
          />
        </ColumnLayoutContainer>
      )}
    />
  )
}

export default HeadersInput
