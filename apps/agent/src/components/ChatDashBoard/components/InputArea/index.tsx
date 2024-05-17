import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, KeyboardEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import { SendIcon } from "@illa-public/icon"
import { MESSAGE_ROLE_TYPE } from "../../interface"
import UploadButton from "../UploadButton"
import UploadKnowledgeFiles from "../UploadKnowledgeFiles"
import { IInputAreaProps } from "./interface"
import {
  inputContainerStyle,
  inputStyle,
  operationStyle,
  sendButtonStyle,
} from "./style"

const InputArea: FC<IInputAreaProps> = ({ sendMessage }) => {
  const { t } = useTranslation()

  const [textAreaVal, setTextAreaVal] = useState("")

  const handleClickSend = () => {
    sendMessage({
      type: MESSAGE_ROLE_TYPE.HUMAN,
      human_message: textAreaVal,
      human_message_id: v4(),
      agent_id: "6b599c46-d246-4045-9b55-f4fa935e419d",
      file_list: [],
      chat_history: [],
    })
    setTextAreaVal("")
  }

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (event.code === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleClickSend()
    }
  }
  const handleOnPaste = () => {}

  return (
    <div css={inputContainerStyle}>
      <textarea
        value={textAreaVal}
        css={inputStyle}
        placeholder={t("editor.ai-agent.placeholder.send")}
        onKeyDown={handleInputKeyDown}
        onPaste={handleOnPaste}
        onChange={(event) => {
          setTextAreaVal(event.target.value)
        }}
      />
      <div css={operationStyle}>
        <UploadKnowledgeFiles />
        <div css={sendButtonStyle}>
          <UploadButton />
          <Button
            type="primary"
            size="large"
            icon={<Icon component={SendIcon} />}
            onClick={handleClickSend}
          >
            {t("editor.ai-agent.button.send")}
          </Button>
        </div>
      </div>
    </div>
  )
}

InputArea.displayName = "InputArea"

export default InputArea
