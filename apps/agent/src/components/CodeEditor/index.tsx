import { debounce } from "lodash-es"
import { FC, useCallback, useMemo, useRef, useState } from "react"
import sanbox from "@/utils/sanbox"
import { ILLACodeMirrorCore } from "./CodeMirror/core"
import { CODE_TYPE } from "./CodeMirror/extensions/interface"
import { illaCodeMirrorTooltipStyle } from "./CodeMirror/theme"
import { fixedValue } from "./CodeMirror/utils"
import { ModalCodeMirror } from "./ModalCodeMirror"
import OpenWindowIcon from "./assets/openWindow.svg?react"
import { CodeEditorProps } from "./interface"
import { ILLACodeMirrorWrapperStyle, openWindowIconHotspotStyle } from "./style"

export const CodeEditor: FC<CodeEditorProps> = (props) => {
  const {
    value = "",
    onChange = () => {},
    placeholder,
    width,
    maxWidth,
    height,
    maxHeight,
    editable = true,
    readOnly,
    minWidth,
    minHeight,
    wrapperCss,
    completionOptions,
    showLineNumbers,
    lang,
    sqlScheme,
    codeType = CODE_TYPE.EXPRESSION,
    singleLine,
    onBlur = () => {},
    onFocus = () => {},
    className,
    canExpand,
    modalTitle = "",
    autoCompleteTipContainer,
  } = props

  const [isExpanded, setIsExpanded] = useState(false)

  const innerCanExpand = canExpand && !readOnly && editable

  const needExecuteCode = value

  const stringSnippets = sanbox.checkRun(needExecuteCode, completionOptions)
  const hasError = stringSnippets.some((item) => item.hasError)
  const containerRef = useRef<HTMLDivElement>(null)

  const debounceHandleChange = useMemo(() => {
    return debounce(onChange, 160)
  }, [onChange])

  const handleOpenExpandModal = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleCloseExpandModal = useCallback(() => {
    setIsExpanded(false)
  }, [])

  return (
    <div
      css={[ILLACodeMirrorWrapperStyle, wrapperCss, illaCodeMirrorTooltipStyle]}
      ref={containerRef}
    >
      <ILLACodeMirrorCore
        className={className}
        placeholder={placeholder}
        value={fixedValue(value)}
        onChange={debounceHandleChange}
        expressions={stringSnippets}
        width={width}
        maxWidth={maxWidth}
        height={height}
        maxHeight={maxHeight}
        editable={editable}
        readOnly={readOnly}
        minWidth={minWidth}
        minHeight={minHeight}
        onBlur={onBlur}
        onFocus={onFocus}
        completionOptions={completionOptions}
        showLineNumbers={showLineNumbers}
        lang={lang}
        codeType={codeType}
        sqlScheme={sqlScheme}
        singleLine={singleLine}
        hasError={hasError}
        autoCompleteTipContainer={autoCompleteTipContainer}
      />
      {innerCanExpand && (
        <div
          css={openWindowIconHotspotStyle}
          className="open-window-icon-hotspot"
          onClick={handleOpenExpandModal}
        >
          <OpenWindowIcon />
        </div>
      )}
      {isExpanded && (
        <ModalCodeMirror
          title={modalTitle}
          onClose={handleCloseExpandModal}
          value={fixedValue(value)}
          onChange={onChange}
          lang={lang}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          codeType={codeType}
          completionOptions={completionOptions}
        />
      )}
    </div>
  )
}

CodeEditor.displayName = "CodeEditor"
