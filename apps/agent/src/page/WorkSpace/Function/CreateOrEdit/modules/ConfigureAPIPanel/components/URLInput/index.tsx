import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import RowLayoutContainer from "@/Layout/AIFunction/FormLayoutContainer/rowLayoutContainer"
import { CodeEditor } from "@/components/CodeEditor"
import { CODE_LANG } from "@/components/CodeEditor/CodeMirror/extensions/interface"
import { inputPathContainerStyle } from "../../style"

const URLInput: FC = () => {
  const { t } = useTranslation()

  const methods = useFormContext()

  return (
    <Controller
      name="content.baseUrl"
      control={methods.control}
      rules={{
        required: t("editor.ai-agent.validation_blank.name"),
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <RowLayoutContainer labelName="URL">
          <CodeEditor
            {...field}
            singleLine
            wrapperCss={inputPathContainerStyle}
            height="32px"
            lang={CODE_LANG.JAVASCRIPT}
            completionOptions={{}}
          />
        </RowLayoutContainer>
      )}
    />
  )
}

export default URLInput
