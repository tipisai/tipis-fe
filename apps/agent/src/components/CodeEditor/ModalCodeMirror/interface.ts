import { CodeEditorProps } from "@/components/CodeEditor/interface"
import { MovableModalProps } from "@/components/Modal/interface"

export interface ModalBodyContent {
  placeholder?: string
  lang?: CodeEditorProps["lang"]
  onChange?: CodeEditorProps["onChange"]
  onFocus?: CodeEditorProps["onFocus"]
  onBlur?: CodeEditorProps["onBlur"]
  value: string
  codeType?: CodeEditorProps["codeType"]
  completionOptions: CodeEditorProps["completionOptions"]
}

export interface FooterContentProps {
  onClickSaveButton: () => void
}

export interface ModalCodeMirrorProps
  extends Omit<MovableModalProps, "bodyContent" | "footerContent">,
    ModalBodyContent {
  onClickSaveButton?: () => void
}
