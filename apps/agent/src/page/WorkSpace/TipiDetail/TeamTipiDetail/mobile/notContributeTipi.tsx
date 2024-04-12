import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import MobileSecondPageLayout from "@/Layout/Workspace/mobile/module/SecondPageLayout"
import { INotContributeContentProps } from "../interface"
import MobileNotContributeContent from "../module/notContributeContent/mobile"
import { contentContainerStyle, placeholderDivStyle } from "./style"

const MobileNotContributeTipi: FC<INotContributeContentProps> = ({
  agentInfo,
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const onClickBack = () => {
    navigate(-1)
  }

  return (
    <MobileSecondPageLayout
      title={t("homepage.edit_tipi.mobile_preview.preview")}
      onClickClose={onClickBack}
      headerExtra={<div css={placeholderDivStyle} />}
    >
      <div css={contentContainerStyle}>
        <MobileNotContributeContent agentInfo={agentInfo} />
      </div>
    </MobileSecondPageLayout>
  )
}

export default MobileNotContributeTipi
