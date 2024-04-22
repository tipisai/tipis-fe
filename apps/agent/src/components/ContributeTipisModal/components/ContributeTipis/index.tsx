import { Switch } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import BlockLayout from "../BlockLayout"
import FirstLabel from "../Label/FistLabel"
import { contributeTipisContainerStyle } from "./style"

const ContributeTipis: FC = () => {
  const { t } = useTranslation()
  return (
    <BlockLayout>
      <div css={contributeTipisContainerStyle}>
        <FirstLabel
          title={t("homepage.contribute_modal.contribute_to_marketplace")}
        />
        <Switch />
      </div>
    </BlockLayout>
  )
}

export default ContributeTipis
