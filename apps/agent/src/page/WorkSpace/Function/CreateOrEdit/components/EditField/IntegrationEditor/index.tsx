import Icon from "@ant-design/icons"
import { Button } from "antd"
import { memo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  DownIcon,
  INTEGRATION_TYPE_MAP_ICON,
  PenIcon,
  PlusIcon,
} from "@illa-public/icon"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Function/LayoutBlock"
import IntegrationSelectorModal from "@/Modules/Integration/CreateOrSelectIntegration/modal"
import { useAppDispatch } from "@/redux/hooks"
import { integrationAPI } from "@/redux/services/integrationAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IFunctionForm } from "../../../interface"
import {
  buttonStyle,
  downIconContainerStyle,
  iconContainerStyle,
  integrationContainerStyle,
  integrationIconStyle,
  integrationNameAndIconStyle,
  integrationNameStyle,
  outerIntegrationContainerStyle,
} from "./style"

const IntegrationEditor = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IFunctionForm>()
  const integrationType = useWatch({
    control,
    name: "resourceType",
  })

  const currentTeamInfo = useGetCurrentTeamInfo()!
  const dispatch = useAppDispatch()

  const [createOrSelectModalShow, setCreateOrSelectModalShow] = useState(false)

  const IntegrationIcon = INTEGRATION_TYPE_MAP_ICON[integrationType]

  return (
    <>
      <Controller
        name="integrationInfo"
        control={control}
        rules={{
          required: t("function.edit.configure.error.integration"),
        }}
        shouldUnregister={false}
        render={({ field, fieldState }) => (
          <LayoutBlock
            title={t("function.edit.configure.label.integration")}
            required
          >
            {!field.value ? (
              <>
                <Button
                  icon={<Icon component={PlusIcon} />}
                  block
                  size="large"
                  danger={!!fieldState.error?.message}
                  onClick={() => {
                    setCreateOrSelectModalShow(true)
                  }}
                >
                  {t("editor.action.panel.btn.new")}
                </Button>
              </>
            ) : (
              <div css={outerIntegrationContainerStyle}>
                <div
                  css={integrationContainerStyle}
                  onClick={() => {
                    setCreateOrSelectModalShow(true)
                  }}
                >
                  <div css={integrationNameAndIconStyle}>
                    {IntegrationIcon ? (
                      <IntegrationIcon css={integrationIconStyle} />
                    ) : (
                      <div css={integrationIconStyle} />
                    )}
                    <p css={integrationNameStyle}>{field.value.resourceName}</p>
                    <div css={downIconContainerStyle}>
                      <DownIcon />
                    </div>
                  </div>
                </div>
                <div
                  css={buttonStyle}
                  onClick={() => {
                    setCreateOrSelectModalShow(true)
                  }}
                >
                  <div css={iconContainerStyle}>
                    <PenIcon />
                  </div>
                </div>
              </div>
            )}
            <ErrorText message={fieldState.error?.message} />

            <IntegrationSelectorModal
              open={createOrSelectModalShow}
              changeOpen={setCreateOrSelectModalShow}
              integrationType={integrationType}
              onConfirm={async (integrationID) => {
                try {
                  const integrationList = await dispatch(
                    integrationAPI.endpoints.getIntegrationList.initiate(
                      currentTeamInfo.id!,
                    ),
                  ).unwrap()
                  const targetIntegration = integrationList.find(
                    (integration) => integration.resourceID === integrationID,
                  )
                  if (targetIntegration) {
                    field.onChange({
                      resourceID: targetIntegration.resourceID,
                      resourceName: targetIntegration.resourceName,
                    })
                    setCreateOrSelectModalShow(false)
                  }
                } catch {}
              }}
              integrationID={field.value?.resourceID ?? ""}
            />
          </LayoutBlock>
        )}
      />
    </>
  )
})

IntegrationEditor.displayName = "IntegrationEditor"

export default IntegrationEditor
