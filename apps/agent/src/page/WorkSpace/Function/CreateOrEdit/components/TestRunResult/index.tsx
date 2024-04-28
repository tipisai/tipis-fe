import Icon from "@ant-design/icons"
import { Button, Drawer } from "antd"
import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { CODE_LANG, CodeEditor } from "@illa-public/code-editor-new"
import { CloseIcon } from "@illa-public/icon"
import { FUNCTION_RUN_RESULT_EVENT } from "@/utils/eventEmitter/constants"
import { IRunResultValue } from "./interface"
import {
  extraInfoContainerStyle,
  labelAndValueContainerStyle,
  labelStyle,
  runResultContainerStyle,
  statusStyle,
} from "./style"
import { TestRunResultEventEmitter } from "./utils"

const TestRunResult: FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [value, setValue] = useState<IRunResultValue>({})

  const { statusCode, result } = value

  const { t } = useTranslation()

  useEffect(() => {
    TestRunResultEventEmitter.on(
      FUNCTION_RUN_RESULT_EVENT.CHANGE_DRAWER_OPEN_STATUS,
      setOpenDrawer,
    )
    TestRunResultEventEmitter.on(
      FUNCTION_RUN_RESULT_EVENT.SET_RUN_RESULT,
      setValue,
    )

    return () => {
      TestRunResultEventEmitter.off(
        FUNCTION_RUN_RESULT_EVENT.CHANGE_DRAWER_OPEN_STATUS,
        setOpenDrawer,
      )
      TestRunResultEventEmitter.off(
        FUNCTION_RUN_RESULT_EVENT.SET_RUN_RESULT,
        setValue,
      )
    }
  }, [])

  return (
    <div css={runResultContainerStyle} className="run-result-container">
      <Drawer
        title={t("function.edit.test.result.response")}
        open={openDrawer}
        placement="bottom"
        getContainer={false}
        height={200}
        maskClosable={false}
        mask={false}
        keyboard={false}
        destroyOnClose
        closable={false}
        extra={
          <div css={extraInfoContainerStyle}>
            {statusCode && (
              <div css={labelAndValueContainerStyle}>
                <p css={labelStyle}>{t("function.edit.test.result.status")}</p>
                <p css={statusStyle(statusCode >= 400)}>{statusCode}</p>
              </div>
            )}

            <Button
              icon={<Icon component={CloseIcon} />}
              type="text"
              size="small"
              onClick={() => {
                setOpenDrawer(false)
              }}
            />
          </div>
        }
      >
        <CodeEditor
          completionOptions={[]}
          styles={{
            height: "100%",
          }}
          readOnly
          value={result}
          options={{
            lang: CODE_LANG.JSON,
            showLineNumbers: true,
          }}
        />
      </Drawer>
    </div>
  )
}

export default TestRunResult
