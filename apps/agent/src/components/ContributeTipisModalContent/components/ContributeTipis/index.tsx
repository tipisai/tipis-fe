import { Switch } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IContributeFromFields } from "../../ContributeContent/interface"
import BlockLayout from "../BlockLayout"
import FirstLabel from "../Label/FistLabel"
import { contributeTipisContainerStyle } from "./style"

const ContributeTipis: FC = () => {
  const { t } = useTranslation()
  const { control } = useFormContext<IContributeFromFields>()
  return (
    <BlockLayout>
      <div css={contributeTipisContainerStyle}>
        <FirstLabel
          title={t("homepage.contribute_modal.contribute_to_marketplace")}
        />
        <Controller
          name="contributeToMarketplace"
          control={control}
          render={({ field }) => <Switch {...field} />}
        />
      </div>
    </BlockLayout>
  )
}

export default ContributeTipis
