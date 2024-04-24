import Icon from "@ant-design/icons"
import { Button } from "antd"
import { memo, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { INTEGRATION_TYPE_MAP_ICON, PlusIcon } from "@illa-public/icon"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import CreateOrSelectIntegrationModal from "@/Modules/Integration/CreateOrSelectIntegration/modal"
import { IBaseFunctionForm } from "../../../interface"
import { IIntegrationEditorProps } from "./interface"
import {
  integrationContainerStyle,
  integrationIconStyle,
  integrationNameAndIconStyle,
  integrationNameStyle,
} from "./style"

const IntegrationEditor = memo((props: IIntegrationEditorProps) => {
  const { integrationType } = props
  const { t } = useTranslation()
  const { control } = useFormContext<IBaseFunctionForm>()

  const [modalShow, setModalShow] = useState(false)

  const IntegrationIcon = INTEGRATION_TYPE_MAP_ICON[integrationType]

  return (
    <>
      <Controller
        name="resourceID"
        control={control}
        rules={{
          required: t("function.edit.configure.label.integration"),
        }}
        shouldUnregister={false}
        render={({ field }) => (
          <LayoutBlock
            title={t("function.edit.configure.label.integration")}
            required
            // errorMessage={errors.description?.message}
          >
            {!field.value ? (
              <>
                <Button
                  icon={<Icon component={PlusIcon} />}
                  block
                  size="large"
                  onClick={() => {
                    setModalShow(true)
                  }}
                >
                  {t("editor.action.panel.btn.new")}
                </Button>
              </>
            ) : (
              <div css={integrationContainerStyle}>
                <div css={integrationNameAndIconStyle}>
                  {IntegrationIcon ? (
                    <IntegrationIcon css={integrationIconStyle} />
                  ) : (
                    <div css={integrationIconStyle} />
                  )}
                  <p css={integrationNameStyle}>{field.value}</p>
                </div>
              </div>
            )}
            <CreateOrSelectIntegrationModal
              open={modalShow}
              changeOpen={setModalShow}
              integrationType={integrationType}
              onConfirm={(integrationID: string) => {
                field.onChange(integrationID)
                setModalShow(false)
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
