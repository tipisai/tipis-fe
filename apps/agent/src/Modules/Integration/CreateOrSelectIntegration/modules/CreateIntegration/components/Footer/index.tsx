import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { PreviousIcon } from "@illa-public/icon"
import { IBaseIntegration } from "@illa-public/public-types"
import BlackButton from "@/components/BlackButton"
import { IFooterProps } from "./interface"
import { confirmButtonStyle, footerContainerStyle } from "./style"

const ConfigElementFooter: FC<IFooterProps> = (props) => {
  const { onBack, onConfirm } = props

  const { handleSubmit } = useFormContext<IBaseIntegration>()

  const onSubmit = (data: IBaseIntegration) => {
    console.log("ddddd", data)
    onConfirm(data.resourceID)
  }

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
        onClick={handleSubmit(onSubmit)}
      >
        Confirm
      </BlackButton>
    </div>
  )
}

export default ConfigElementFooter
