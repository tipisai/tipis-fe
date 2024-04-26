import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CodeEditor } from "@illa-public/code-editor-new"
import { IBaseFunction, IListObjectContent } from "@illa-public/public-types"
import { useVariableToCompletionOption } from "@/page/WorkSpace/Function/CreateOrEdit/util"
import LabelWithEditor from "../../../../components/labelWithEditor"

const MaxKeysEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IListObjectContent>>()
  const { t } = useTranslation()

  const completionOptions = useVariableToCompletionOption()

  return (
    <LabelWithEditor label={t("editor.action.form.label.tx.max_keys")}>
      <Controller
        control={control}
        name="content.config.maxKeys"
        render={({ field }) => {
          return (
            <CodeEditor
              {...field}
              completionOptions={completionOptions}
              options={{
                singleLine: true,
              }}
            />
          )
        }}
      />
    </LabelWithEditor>
  )
}

export default MaxKeysEditor
