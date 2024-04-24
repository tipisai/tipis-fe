import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PreviousIcon } from "@illa-public/icon"
import { IBaseIntegration } from "@illa-public/public-types"
import BlackButton from "@/components/BlackButton"
import { IFooterProps } from "./interface"
import { confirmButtonStyle, footerContainerStyle } from "./style"

const ConfigElementFooter: FC<IFooterProps> = (props) => {
  const { onBack, onConfirm } = props
  const { t } = useTranslation()

  const { handleSubmit } = useFormContext<IBaseIntegration>()

  const onSubmit = (data: IBaseIntegration) => {
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
          {t("function.edit.variable_modal.button.back")}
        </Button>
      )}
      <BlackButton
        type="primary"
        htmlType="submit"
        css={confirmButtonStyle}
        size="large"
        onClick={handleSubmit(onSubmit)}
      >
        {t("function.edit.variable_modal.button.confirm")}
      </BlackButton>
    </div>
  )
}

export default ConfigElementFooter
