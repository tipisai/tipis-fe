import { FC } from "react"
import { CodeEditor } from "@illa-public/code-editor-new"
import { IPromptProps } from "./interface"
import { knowledgeContainerStyle, labelStyle } from "./style"

const Prompt: FC<IPromptProps> = (props) => {
  return (
    <div css={knowledgeContainerStyle}>
      <p css={labelStyle}>Prompt</p>
      <CodeEditor
        styles={{
          minWidth: "100%",
        }}
        readOnly
        editable={false}
        value={props.prompt}
        completionOptions={props.parameters}
      />
    </div>
  )
}

Prompt.displayName = "Prompt"
export default Prompt
