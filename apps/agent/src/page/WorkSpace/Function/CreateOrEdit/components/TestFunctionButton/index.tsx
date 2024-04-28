import { Button } from "antd"
import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { SuccessCircleIcon } from "@illa-public/icon"
import { NextIcon } from "@illa-public/icon"
import { IFunctionInterface } from "@illa-public/public-types"
import { useRunAIToolsMutation } from "@/redux/services/aiToolsAPI"
import { FUNCTION_RUN_RESULT_EVENT } from "@/utils/eventEmitter/constants"
import { TestRunResultEventEmitter } from "../TestRunResult/utils"
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

  const { control } = useFormContext<IFunctionInterface>()
  const resourceID = useWatch({
    control,
    name: "resourceID",
  })

  const [runAITools] = useRunAIToolsMutation()

  const onClickTestResultButton = () => {
    TestRunResultEventEmitter.emit(
      FUNCTION_RUN_RESULT_EVENT.CHANGE_DRAWER_OPEN_STATUS,
      true,
    )
  }

  const onClickTestConnectionButton = async () => {
    try {
      await runAITools({
        teamID: "",
        aiToolID: resourceID,
        context: {},
      }).unwrap()
      TestRunResultEventEmitter.emit(
        FUNCTION_RUN_RESULT_EVENT.CHANGE_DRAWER_OPEN_STATUS,
        true,
      )
      TestRunResultEventEmitter.emit(FUNCTION_RUN_RESULT_EVENT.SET_RUN_RESULT, {
        statusCode: 200,
        time: 1000,
        result: "test result",
      })
    } catch {}
  }

  return (
    <div css={testFunctionRunContainerStyle}>
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
      <Button size="large" onClick={onClickTestConnectionButton}>
        {t("function.edit.test.button.test_connection")}
      </Button>
    </div>
  )
}

export default TestFunctionButton
