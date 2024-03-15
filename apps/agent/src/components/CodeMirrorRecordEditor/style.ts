import { css } from "@emotion/react"
import { globalColor, illaPrefix } from "@illa-public/color-scheme"

export function applyRecordEditorContainerStyle(label: string) {
  return css`
    display: flex;
    padding-right: ${label !== "" ? "16px" : "0"};
    flex-direction: row;
  `
}

export const recordEditorStyle = css`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 8px;
`

export const recordStyle = css`
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  & > button {
    color: ${globalColor(`--${illaPrefix}-grayBlue-05`)};

    :hover {
      color: ${globalColor(`--${illaPrefix}-grayBlue-02`)};
      transition: color 200ms ease-in-out;
    }
  }
`

export const recordKeyStyle = css`
  min-width: 160px;
  flex-grow: 1;
  width: 0;
  height: auto;

  .ͼ1.cm-editor {
    border-radius: 8px 0 0 8px;
  }
`

export const recordValueStyle = (canEditValue: boolean) => css`
  margin-left: -1px;
  flex-grow: 1;
  width: 0;
  height: auto;

  .ͼ1.cm-editor {
    border-radius: ${canEditValue ? "0" : "0 8px 8px 0"};
  }
`

export const recordEditorLabelStyle = css`
  min-width: 160px;
  margin-left: 16px;
  margin-right: 16px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  font-size: 14px;
  font-weight: 500;
  color: ${globalColor(`--${illaPrefix}-grayBlue-02`)};
`
