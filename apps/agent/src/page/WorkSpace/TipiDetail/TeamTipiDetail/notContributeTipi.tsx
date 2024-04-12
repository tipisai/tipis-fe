import { FC } from "react"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetNotContributeTipDetail } from "@/utils/tipis/hook"
import MobileNotContributeTipi from "./mobile/notContributeTipi"
import PCNotContributeTipi from "./pc/notContributeTipi"

const NotContributeTipiDetail: FC = () => {
  const { data, isLoading, isError } = useGetNotContributeTipDetail()

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }
  return data ? (
    <LayoutAutoChange
      desktopPage={<PCNotContributeTipi agentInfo={data} />}
      mobilePage={<MobileNotContributeTipi agentInfo={data} />}
    />
  ) : null
}

NotContributeTipiDetail.displayName = "NotContributeTipiDetail"

export default NotContributeTipiDetail
