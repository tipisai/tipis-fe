import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IAIFunctionResource } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import ParametersList from "../ParametersList"

const ParametersEditor: FC = () => {
  const { t } = useTranslation()

  const methods = useFormContext<IAIFunctionResource>()
  return (
    <Controller
      name="config.variables"
      control={methods.control}
      render={() => (
        <LayoutBlock title={t("Parameters")}>
          <ParametersList />
        </LayoutBlock>
      )}
    />
  )
}

export default ParametersEditor
