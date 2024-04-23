import { Button } from "antd"
import { FC } from "react"
import BlackButton from "@/components/BlackButton"
import { ISelectIntegrationFooterProps } from "./interface"
import { confirmButtonStyle, footerContainerStyle } from "./style"

const SelectIntegrationFooter: FC<ISelectIntegrationFooterProps> = (props) => {
  const { onCreateIntegration, selectedIntegration, onConfirm } = props

  const handleClickConfirm = () => {
    onConfirm(selectedIntegration)
  }
  return (
    <div css={footerContainerStyle}>
      {onCreateIntegration && (
        <Button
          type="text"
          css={confirmButtonStyle}
          size="large"
          onClick={onCreateIntegration}
        >
          Create
        </Button>
      )}
      <BlackButton
        disabled={!selectedIntegration}
        type="primary"
        css={confirmButtonStyle}
        size="large"
        onClick={handleClickConfirm}
      >
        Confirm
      </BlackButton>
    </div>
  )
}

export default SelectIntegrationFooter
