import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const codeEditorErrorStyle = (isError: boolean) => {
  let style
  if (isError) {
    style = css`
      .cm-editor,
      .cm-editor:hover,
      .cm-editor.cm-focused {
        border-color: ${getColor("red", "03")}!important;
      }
    `
  }
  return style
}
