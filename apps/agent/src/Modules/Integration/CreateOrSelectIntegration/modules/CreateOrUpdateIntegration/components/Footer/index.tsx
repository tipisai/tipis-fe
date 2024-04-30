import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PreviousIcon } from "@illa-public/icon"
import { IBaseIntegration } from "@illa-public/public-types"
import BlackButton from "@/components/BlackButton"
import {
  useCreateIntegrationMutation,
  useUpdateIntegrationByIDMutation,
} from "@/redux/services/integrationAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IFooterProps } from "./interface"
import { confirmButtonStyle, footerContainerStyle } from "./style"

const ConfigElementFooter: FC<IFooterProps> = (props) => {
  const { onBack, onConfirm } = props
  const { t } = useTranslation()

  const { handleSubmit } = useFormContext<IBaseIntegration>()
  const currentTeamInfo = useGetCurrentTeamInfo()!
  const [createIntegration, { isLoading: isCreateLoading }] =
    useCreateIntegrationMutation()

  const [updateIntegrationByID, { isLoading: isUpdateLoading }] =
    useUpdateIntegrationByIDMutation()

  const createIntegrationWhenSubmit = async (data: IBaseIntegration) => {
    try {
      const integrationInfo = await createIntegration({
        teamID: currentTeamInfo.id,
        integrationData: data,
      }).unwrap()
      onConfirm(integrationInfo.resourceID)
    } catch {}
  }

  const updateIntegrationWhenSubmit = async (data: IBaseIntegration) => {
    try {
      const integrationInfo = await updateIntegrationByID({
        teamID: currentTeamInfo.id,
        integrationID: data.resourceID!,
        integrationData: data,
      }).unwrap()
      onConfirm(integrationInfo.resourceID)
    } catch {}
  }

  const onSubmit = async (data: IBaseIntegration) => {
    if (data.resourceID) {
      await updateIntegrationWhenSubmit(data)
    } else {
      await createIntegrationWhenSubmit(data)
    }
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
        block={!onBack}
        css={confirmButtonStyle}
        size="large"
        onClick={handleSubmit(onSubmit)}
        loading={isCreateLoading || isUpdateLoading}
      >
        {t("function.edit.variable_modal.button.confirm")}
      </BlackButton>
    </div>
  )
}

export default ConfigElementFooter
