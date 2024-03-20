import { FC } from "react"
import { Navigate } from "react-router-dom"
import FullSectionLoading from "../../../components/FullSectionLoading"
import { useGetTipiContributed } from "../../../utils/tipis/hook"
import ContributeTipiDetail from "./contributeTipi"
import NotContributeTipiDetail from "./notContributeTipi"

const TipiDetailPage: FC = () => {
  const { data, isLoading, isError } = useGetTipiContributed()

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return data ? (
    data.isPublishedToMarketplace ? (
      <ContributeTipiDetail />
    ) : (
      <NotContributeTipiDetail />
    )
  ) : null
}

export default TipiDetailPage
