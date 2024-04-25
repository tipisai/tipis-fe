import Icon from "@ant-design/icons"
import { Button } from "antd"
import { memo, useState } from "react"
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
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
import { IBaseFunctionForm } from "../../../interface"
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
  const { control } = useFormContext<IBaseFunctionForm>()
  const integrationType = useWatch({
    control,
    name: "type",
  })

  const [createOrSelectModalShow, setCreateOrSelectModalShow] = useState(false)
  const { errors } = useFormState({
    control: control,
  })

  const IntegrationIcon = INTEGRATION_TYPE_MAP_ICON[integrationType]

  return (
    <>
      <Controller
        name="integrationID"
        control={control}
        rules={{
          required: t("function.edit.configure.error.integration"),
        }}
        shouldUnregister={false}
        render={({ field }) => (
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
                  danger={!!errors.integrationID?.message}
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
                    <p css={integrationNameStyle}>{field.value}</p>
                    <div css={downIconContainerStyle}>
                      <DownIcon />
                    </div>
                  </div>
                </div>
                <div css={buttonStyle}>
                  <div css={iconContainerStyle}>
                    <PenIcon />
                  </div>
                </div>
              </div>
            )}
            <ErrorText message={errors.integrationID?.message} />

            <IntegrationSelectorModal
              open={createOrSelectModalShow}
              changeOpen={setCreateOrSelectModalShow}
              integrationType={integrationType}
              onConfirm={(integrationID: string) => {
                field.onChange(integrationID)
                setCreateOrSelectModalShow(false)
              }}
            />
          </LayoutBlock>
        )}
      />
    </>
  )
})

IntegrationEditor.displayName = "IntegrationEditor"

export default IntegrationEditor
