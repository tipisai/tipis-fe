import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { SuccessCircleIcon } from "@illa-public/icon"
import { NextIcon } from "@illa-public/icon"
import { FUNCTION_RUN_RESULT_EVENT } from "@/utils/eventEmitter/constants"
import { TestRunResultEventEmitter } from "@/utils/function"
import {
  useGetParamsListByResourceType,
  useTestRunFunction,
} from "@/utils/function/hook"
import TestValueModal from "../TestValueInputModal"
import {
  actionRunResultButtonStyle,
  iconAndTextContainerStyle,
  iconContainerStyle,
  nextIconStyle,
  testFunctionRunContainerStyle,
  textStyle,
} from "./style"

const TestFunctionButton: FC = () => {
  const { t } = useTranslation()

  const parameterList = useGetParamsListByResourceType()

  const [showModal, setShowModal] = useState(false)

  const onClickTestResultButton = () => {
    TestRunResultEventEmitter.emit(
      FUNCTION_RUN_RESULT_EVENT.CHANGE_DRAWER_OPEN_STATUS,
      true,
    )
  }

  const { onTestRunFunction, testResult, isLoading } = useTestRunFunction()
  const onClickTestConnectionButton = async () => {
    if (parameterList.length === 0) {
      await onTestRunFunction()
    } else {
      setShowModal(true)
    }
  }

  return (
    <div css={testFunctionRunContainerStyle}>
      {testResult && (
        <div css={actionRunResultButtonStyle} onClick={onClickTestResultButton}>
          <div css={iconAndTextContainerStyle}>
            <SuccessCircleIcon />
            <p css={textStyle}>{t("function.edit.test.result.success")}</p>
            {/* <p>  t("function.edit.test.result.failed")</p> */}
          </div>
          <div css={iconContainerStyle}>
            <NextIcon css={nextIconStyle} />
          </div>
        </div>
      )}
      <Button
        size="large"
        onClick={onClickTestConnectionButton}
        loading={isLoading}
      >
        {t("function.edit.test.button.test_connection")}
      </Button>
      <TestValueModal open={showModal} changeOpen={setShowModal} />
    </div>
  )
}

export default TestFunctionButton
