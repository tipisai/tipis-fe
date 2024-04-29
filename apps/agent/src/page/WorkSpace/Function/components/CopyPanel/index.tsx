import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { CopyIcon } from "@illa-public/icon"
import { ICopyPanelProps } from "./interface"
import {
  contentContainerStyle,
  contentTextStyle,
  copyPanelHeaderStyle,
  copyPanelStyle,
  headerTextStyle,
} from "./style"

const CopyPanel: FC<ICopyPanelProps> = (props) => {
  const { t } = useTranslation()
  const { title, copyButtonProps, content, onClickCopyButton } = props

  const { text = t("user_management.modal.link.copy"), disabled } =
    copyButtonProps ?? {}
  return (
    <div css={copyPanelStyle}>
      <div css={copyPanelHeaderStyle}>
        <p css={headerTextStyle}>{title}</p>
        <Button
          icon={<Icon component={CopyIcon} />}
          onClick={onClickCopyButton}
          disabled={disabled}
        >
          {text}
        </Button>
      </div>
      <div css={contentContainerStyle}>
        <div css={contentTextStyle}>{content}</div>
      </div>
    </div>
  )
}

export default CopyPanel
