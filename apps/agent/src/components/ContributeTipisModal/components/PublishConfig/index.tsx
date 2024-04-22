import { Switch } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import BlockLayout from "../BlockLayout"
import FirstLabel from "../Label/FistLabel"
import { PublishConfigContainerStyle } from "./style"

const PublishConfig: FC = () => {
  const { t } = useTranslation()
  return (
    <BlockLayout>
      <div css={PublishConfigContainerStyle}>
        <FirstLabel
          title={t("homepage.contribute_modal.set_public.title")}
          subTitle={t("homepage.contribute_modal.set_public.desc")}
        />
        <Switch />
      </div>
    </BlockLayout>
  )
}

export default PublishConfig
