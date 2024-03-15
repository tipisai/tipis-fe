import { ICodeMirrorOptions } from "./extensions/interface"

export interface ILLACodeMirrorProps extends ICodeMirrorOptions {
  value?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: (value: string) => void
  height?: string
  minHeight?: string
  maxHeight?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  editable?: boolean
  readOnly?: boolean
  placeholder?: string
  className?: string
  hasError?: boolean
}

export enum RESULT_TYPES {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  OBJECT = "OBJECT",
  ARRAY = "ARRAY",
  FUNCTION = "FUNCTION",
  UNDEFINED = "UNDEFINED",
  NULL = "NULL",
  UNKNOWN = "UNKNOWN",
}
