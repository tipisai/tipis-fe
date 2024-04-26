import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CodeEditor } from "@illa-public/code-editor-new"
import {
  IBaseFunction,
  IDownloadAnObjectContent,
} from "@illa-public/public-types"
import { useVariableToCompletionOption } from "@/page/WorkSpace/Function/CreateOrEdit/util"
import LabelWithEditor from "../../../../components/labelWithEditor"

const ObjectNameEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IDownloadAnObjectContent>>()
  const { t } = useTranslation()

  const completionOptions = useVariableToCompletionOption()

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
