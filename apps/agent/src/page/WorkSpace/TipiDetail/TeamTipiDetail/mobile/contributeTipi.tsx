import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import MobileSecondPageLayout from "@/Layout/Workspace/mobile/module/SecondPageLayout"
import { IContributeTipiProps } from "../interface"
import ContributeContent from "../module/contributeContent"
import { contentContainerStyle, placeholderDivStyle } from "./style"

const MobileContributeTipi: FC<IContributeTipiProps> = (props) => {
  const { aiAgentMarketPlaceInfo } = props
  const { t } = useTranslation()

  const navigate = useNavigate()

  const onClickBack = async () => {
    navigate(-1)
  }

  return (
    <MobileSecondPageLayout
      title={t("homepage.edit_tipi.mobile_preview.preview")}
      onClickClose={onClickBack}
      headerExtra={<div css={placeholderDivStyle} />}
    >
      <div css={contentContainerStyle}>
        <ContributeContent aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo} />
      </div>
    </MobileSecondPageLayout>
  )
}

export default MobileContributeTipi
