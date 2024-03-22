import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CodeEditor } from "@illa-public/code-editor"
import { Agent } from "@illa-public/public-types"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { SCROLL_ID } from "../../interface"
import { codeEditorErrorStyle } from "./style"

const PromptEditor: FC = memo(() => {
  const { t } = useTranslation()

  const methods = useFormContext<Agent>()

  const { errors } = useFormState({
    control: methods.control,
  })

  const [variables] = methods.watch(["variables"])

  return (
    <Controller
      name="prompt"
      control={methods.control}
      rules={{
        required: t("editor.ai-agent.validation_blank.prompt"),
      }}
      shouldUnregister={false}
      render={({ field: promptField }) => (
        <LayoutBlock title={"Prompt"} required scrollId={SCROLL_ID.PROMPT}>
          <div>
            <CodeEditor
              {...promptField}
              css={codeEditorErrorStyle(!!errors.prompt)}
              placeholder={t("editor.ai-agent.placeholder.prompt")}
              height="600px"
              completionOptions={variables}
            />
            {errors.prompt?.message && (
              <ErrorText errorMessage={errors.prompt?.message} />
            )}
          </div>
        </LayoutBlock>
      )}
    />
  )
})
PromptEditor.displayName = "PromptEditor"

export default PromptEditor
