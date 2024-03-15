import { FC, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CodeEditor } from "@/components/CodeEditor"
import { ModalBodyContent } from "@/components/CodeEditor/ModalCodeMirror/interface"
import {
  applyCodeMirrorWrapperStyle,
  contentWrapperStyle,
} from "@/components/CodeEditor/ModalCodeMirror/style"
import { illaCodeMirrorTooltipStyle } from "../CodeMirror/theme"

export const ModalContent: FC<ModalBodyContent> = (props) => {
  const { lang, onChange, value, placeholder, codeType, completionOptions } =
    props

  const codeMirrorRef = useRef<HTMLDivElement>(null)

  const [canRender, setCanRender] = useState(false)

  useLayoutEffect(() => {
    setCanRender(true)

    return () => {
      setCanRender(false)
    }
  }, [])

  return (
    <div css={contentWrapperStyle}>
      <div css={applyCodeMirrorWrapperStyle}>
        <CodeEditor
          completionOptions={completionOptions}
          lang={lang}
          showLineNumbers
          minHeight="88px"
          height="100%"
          value={value}
          onChange={onChange}
          canExpand={false}
          placeholder={placeholder}
          codeType={codeType}
          autoCompleteTipContainer={codeMirrorRef.current ?? undefined}
        />
      </div>
      {canRender &&
        createPortal(
          <div
            className="illaCodeMirrorModalWrapper"
            css={illaCodeMirrorTooltipStyle}
            ref={codeMirrorRef}
          />,
          document.body,
        )}
    </div>
  )
}
