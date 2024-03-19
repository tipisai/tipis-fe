import Icon from "@ant-design/icons"
import { App, Typography } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { CodeProps } from "react-markdown/lib/ast-to-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { CopyIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import { getTextValue } from "../utils"
import {
  codeBlockContainerStyle,
  codeBlockHeaderStyle,
  copyStyle,
  inlineCodeStyle,
} from "./style"

const Code: FC<CodeProps> = (props) => {
  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()

  return !!props.inline ? (
    <Typography.Text css={inlineCodeStyle}>
      {getTextValue(props.children)}
    </Typography.Text>
  ) : (
    <div css={codeBlockContainerStyle}>
      <div css={codeBlockHeaderStyle}>
        <span>
          {/language-(\w+)/.exec(props.className || "")?.[1] ?? "markdown"}
        </span>
        <div
          css={copyStyle}
          onClick={() => {
            copyToClipboard(props.children?.[0])
            messageAPI.success({
              content: t("copied"),
            })
          }}
        >
          <Icon component={CopyIcon} size={16} />
          <span>{t("editor.ai-agent.copy_code")}</span>
        </div>
      </div>
      <SyntaxHighlighter
        {...props}
        CodeTag="div"
        PreTag="div"
        wrapLongLines={true}
        customStyle={{
          background: "transparent",
        }}
        language={
          /language-(\w+)/.exec(props.className || "")?.[1] ?? "markdown"
        }
        style={oneLight}
      >
        {getTextValue(props.children)}
      </SyntaxHighlighter>
    </div>
  )
}

export default Code
