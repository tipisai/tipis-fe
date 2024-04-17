import Icon from "@ant-design/icons"
import { App, Typography } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { CodeProps } from "react-markdown/lib/ast-to-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { CopyIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import { CODE_STATUS, MarkdownMessageProps } from "../../interface"
import { getTextValue } from "../../utils"
import {
  codeBlockContainerStyle,
  codeBlockHeaderStyle,
  copyStyle,
  inlineCodeStyle,
} from "./style"

const CustomCode: FC<
  CodeProps & Pick<MarkdownMessageProps, "codeStatus" | "isReceiving">
> = (props) => {
  const { codeStatus = CODE_STATUS.DEFAULT, isReceiving } = props
  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()
  const language =
    /language-(\w+)/.exec(props.className || "")?.[1] ?? "markdown"

  const handleCopyClick = () => {
    if (isReceiving) {
      return
    }
    copyToClipboard(props.children?.[0])
    messageAPI.success({
      content: t("copied"),
    })
  }

  return !!props.inline ? (
    <Typography.Text css={inlineCodeStyle}>
      {getTextValue(props.children)}
    </Typography.Text>
  ) : (
    <div css={codeBlockContainerStyle(codeStatus)}>
      <div css={codeBlockHeaderStyle(codeStatus)}>
        <span>{language.toLocaleLowerCase()}</span>
        <div css={copyStyle(isReceiving)} onClick={handleCopyClick}>
          <Icon component={CopyIcon} size={16} />
          <span>{t("editor.ai-agent.copy_code")}</span>
        </div>
      </div>
      <SyntaxHighlighter
        CodeTag="div"
        PreTag="div"
        wrapLongLines={true}
        customStyle={{
          background: "transparent",
        }}
        language={language.toLocaleLowerCase()}
        style={{
          ...oneLight,
          ['code[class*="language-"]']: {
            background: "transparent",
          },
        }}
        wrapLines
        lineProps={{ style: { wordBreak: "break-all" } }}
      >
        {getTextValue(props.children)}
      </SyntaxHighlighter>
    </div>
  )
}

export default CustomCode
