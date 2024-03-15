import { FC } from "react"
import { useTranslation } from "react-i18next"
import { ModalContent } from "@/components/CodeEditor/ModalCodeMirror/content"
import { ModalCodeMirrorProps } from "@/components/CodeEditor/ModalCodeMirror/interface"
import { MovableModal } from "@/components/Modal/movableModal"

export const ModalCodeMirror: FC<ModalCodeMirrorProps> = (props) => {
  const {
    title,
    value,
    lang,
    codeType,
    onChange,
    onClose,
    placeholder,
    onBlur,
    onFocus,
    completionOptions,
  } = props
  const { t } = useTranslation()

  return (
    <MovableModal
      title={title || t("editor.inspect.setter_label.code.write_code")}
      bodyContent={
        <ModalContent
          lang={lang}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          codeType={codeType}
          completionOptions={completionOptions}
        />
      }
      footerContent={null}
      onClose={onClose}
    />
  )
}
