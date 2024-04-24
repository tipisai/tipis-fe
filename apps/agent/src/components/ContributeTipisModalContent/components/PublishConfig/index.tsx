import { Typography } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import BlackSwitch from "@/components/BlackSwitch"
import { IContributeFromFields } from "../../ContributeContent/interface"
import BlockLayout from "../BlockLayout"
import FirstLabel from "../Label/FistLabel"
import { PublishConfigContainerStyle } from "./style"

const TIPI_HELP =
  "https://help.tipis.ai/en/articles/9229356-contribute-your-tipi"

const PublishConfig: FC = () => {
  const { t } = useTranslation()
  const { control } = useFormContext<IContributeFromFields>()

  return (
    <BlockLayout>
      <div css={PublishConfigContainerStyle}>
        <FirstLabel
          title={t("homepage.contribute_modal.set_public.title")}
          subTitle={
            <Trans
              i18nKey="homepage.contribute_modal.set_public.desc"
              t={t}
              components={[
                <Typography.Link
                  key={TIPI_HELP}
                  href={TIPI_HELP}
                  target="__blank"
                  style={{
                    fontSize: 12,
                  }}
                />,
              ]}
            />
          }
        />
        <Controller
          name="publishConfiguration"
          control={control}
          render={({ field }) => <BlackSwitch {...field} size="small" />}
        />
      </div>
    </BlockLayout>
  )
}

export default PublishConfig
