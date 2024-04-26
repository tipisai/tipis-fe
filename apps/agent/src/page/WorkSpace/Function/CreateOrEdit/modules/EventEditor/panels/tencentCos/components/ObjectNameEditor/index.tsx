import { FC } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CodeEditor } from "@illa-public/code-editor-new"
import {
  IBaseFunction,
  IDownloadAnObjectContent,
} from "@illa-public/public-types"
import LabelWithEditor from "../../../../components/labelWithEditor"
import { variableToCompletionOption } from "../../../../util"

const ObjectNameEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IDownloadAnObjectContent>>()
  const { t } = useTranslation()
  const parameters = useWatch({
    control,
    name: "parameters",
  })

  const completionOptions = parameters
    .map((item) => variableToCompletionOption(item))
    .flat()

  return (
    <LabelWithEditor label={t("editor.action.form.label.tx.object_name")}>
      <Controller
        control={control}
        name="content.config.objectName"
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

export default ObjectNameEditor
