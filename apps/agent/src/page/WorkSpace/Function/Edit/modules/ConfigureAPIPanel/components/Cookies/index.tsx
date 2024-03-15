import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IAIFunctionResource } from "@illa-public/public-types"
import ColumnLayoutContainer from "@/Layout/AIFunction/FormLayoutContainer/columnLayoutContainer"
import { RecordEditor } from "@/components/CodeMirrorRecordEditor"

const CookiesInput: FC = () => {
  const { t } = useTranslation()

  const methods = useFormContext<IAIFunctionResource>()

  return (
    <Controller
      name="content.cookies"
      control={methods.control}
      rules={{
        required: t("editor.ai-agent.validation_blank.name"),
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <ColumnLayoutContainer
          labelName={t("editor.action.resource.restapi.label.cookies")}
        >
          <RecordEditor
            records={field.value}
            completionOptions={{}}
            onAdd={() => {
              const newCookies = [...field.value].concat({
                key: "",
                value: "",
              })
              field.onChange(newCookies)
            }}
            onChangeKey={(index, key) => {
              const newCookies = [...field.value]
              newCookies[index] = {
                ...newCookies[index],
                key: key,
              }
              field.onChange(newCookies)
            }}
            onChangeValue={(index, _, value) => {
              const newCookies = [...field.value]
              newCookies[index] = {
                ...newCookies[index],
                value: value,
              }
              field.onChange(newCookies)
            }}
            onDelete={(index) => {
              const newCookies = [...field.value].filter((_, i) => i !== index)
              field.onChange(newCookies)
            }}
            label={""}
          />
        </ColumnLayoutContainer>
      )}
    />
  )
}

export default CookiesInput
