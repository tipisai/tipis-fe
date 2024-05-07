import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CodeEditor } from "@illa-public/code-editor-new"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IAgentForm, SCROLL_ID } from "../../interface"

const PromptEditor: FC = memo(() => {
  const { t } = useTranslation()

  const methods = useFormContext<IAgentForm>()

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
        <LayoutBlock
          title={"Prompt"}
          required
          scrollId={SCROLL_ID.PROMPT}
          errorMessage={errors.prompt?.message}
        >
          <div>
            <CodeEditor
              {...promptField}
              // css={codeEditorErrorStyle(!!errors.prompt)}
              placeholder={t("editor.ai-agent.placeholder.prompt")}
              styles={{
                height: "100%",
                minHeight: "200px",
                maxHeight: "600px",
              }}
              completionOptions={variables}
              canExpand
              modalTitle="prompt"
            />
          </div>
        </LayoutBlock>
      )}
    />
  )
})
PromptEditor.displayName = "PromptEditor"

export default PromptEditor
