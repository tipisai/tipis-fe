import { Input } from "antd"
import { FC, Suspense } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IBaseIntegration } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { INTEGRATION_TYPE_MAP_CONFIG_ELEMENT } from "./config"
import { ConfigElementProps } from "./interface"

const ConfigElement: FC<ConfigElementProps> = (props) => {
  const { integrationType } = props
  const { control } = useFormContext<IBaseIntegration>()
  const { t } = useTranslation()

  const IntegrationConfigElement =
    INTEGRATION_TYPE_MAP_CONFIG_ELEMENT[integrationType]
  return (
    <>
      <Controller
        name="resourceName"
        control={control}
        rules={{
          required: t("editor.action.form.tips.tx.name"),
        }}
        render={({ field, fieldState }) => {
          return (
            <LabelWithController
              title="Name"
              required
              errorMessage={fieldState.error?.message}
            >
              <Input size="large" {...field} />
            </LabelWithController>
          )
        }}
      />

      <Suspense>
        <IntegrationConfigElement />
      </Suspense>
    </>
  )
}

export default ConfigElement
