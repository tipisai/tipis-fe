import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { PreviousIcon } from "@illa-public/icon"
import BlackButton from "@/components/BlackButton"
import { IFooterProps } from "./interface"
import { confirmButtonStyle, footerContainerStyle } from "./style"

const ConfigElementFooter: FC<IFooterProps> = (props) => {
  const { onBack } = props
  return (
    <div css={footerContainerStyle(!!onBack)}>
      {onBack && (
        <Button
          type="text"
          onClick={onBack}
          icon={<Icon component={PreviousIcon} />}
          size="large"
        >
          Back
        </Button>
      )}
      <BlackButton
        type="primary"
        htmlType="submit"
        css={confirmButtonStyle}
        size="large"
      >
        Confirm
      </BlackButton>
    </div>
  )
}

export default ConfigElementFooter
