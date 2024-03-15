import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { AddIcon, DeleteIcon } from "@illa-public/icon"
import { CodeEditor } from "@/components/CodeEditor"
import { CODE_LANG } from "@/components/CodeEditor/CodeMirror/extensions/interface"
import { RecordEditorProps } from "./interface"
import {
  applyRecordEditorContainerStyle,
  recordEditorLabelStyle,
  recordEditorStyle,
  recordKeyStyle,
  recordStyle,
  recordValueStyle,
} from "./style"

export const RecordEditor: FC<RecordEditorProps> = (props) => {
  const {
    name,
    records,
    label,
    completionOptions,
    options = {},
    onDelete,
    onAdd,
    onChangeKey,
    onChangeValue,
  } = props

  const {
    canAdd = true,
    canDelete = true,
    canEditKey = true,
    canEditValue = true,
  } = options

  const { t } = useTranslation()

  const recordList = useMemo(() => {
    return (
      <>
        {records?.map((record, index) => {
          return (
            <div css={recordStyle} key={index}>
              <CodeEditor
                wrapperCss={recordKeyStyle}
                height="32px"
                value={record.key}
                lang={CODE_LANG.JAVASCRIPT}
                placeholder="key"
                onChange={(value) => {
                  onChangeKey?.(index, value.trim(), record.value, name)
                }}
                singleLine
                editable={canEditKey}
                completionOptions={completionOptions}
                canExpand
              />
              <CodeEditor
                height="32px"
                editable={canEditValue}
                wrapperCss={recordValueStyle(canDelete)}
                lang={CODE_LANG.JAVASCRIPT}
                placeholder="value"
                value={record.value}
                singleLine
                onChange={(value) => {
                  onChangeValue?.(index, record.key, value.trim(), name)
                }}
                completionOptions={completionOptions}
                canExpand
              />
              {canDelete && (
                <Button
                  type="text"
                  onClick={() => {
                    onDelete?.(index, record, name)
                  }}
                  icon={<Icon component={DeleteIcon} />}
                />
              )}
            </div>
          )
        })}
      </>
    )
  }, [
    canDelete,
    canEditKey,
    canEditValue,
    completionOptions,
    name,
    onChangeKey,
    onChangeValue,
    onDelete,
    records,
  ])

  return (
    <div css={applyRecordEditorContainerStyle(label)}>
      {label != "" && (
        <span css={recordEditorLabelStyle}>
          <span>{label}</span>
        </span>
      )}
      <div css={recordEditorStyle}>
        {recordList}
        {canAdd && (
          <span>
            <Button
              type="text"
              onClick={() => {
                onAdd?.(name)
              }}
              icon={<Icon component={AddIcon} />}
            >
              {t("editor.action.panel.btn.new")}
            </Button>
          </span>
        )}
      </div>
    </div>
  )
}

RecordEditor.displayName = "RecordEditor"
