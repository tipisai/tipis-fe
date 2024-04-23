import { FC, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import Actions from "../components/Actions"
import ContributeTipis from "../components/ContributeTipis"
import PublishConfig from "../components/PublishConfig"
import TagController from "../components/TagController"
import {
  IContributeFromFields,
  IContributeTipisModalContentProps,
} from "./interface"

const ContributeTipisModalContent: FC<IContributeTipisModalContentProps> = ({
  isContribute,
  tipisID,
  contributeCallback,
}) => {
  const { data } = useGetAIAgentMarketplaceInfoQuery(
    { aiAgentID: tipisID },
    {
      skip: !isContribute,
    },
  )
  const contributeFrom = useForm<IContributeFromFields>({
    defaultValues: {
      contributeToMarketplace: isContribute,
      publishConfiguration: data?.marketplace?.config?.publishConfiguration,
    } as IContributeFromFields,
  })

  useEffect(() => {
    return () => {
      contributeFrom.reset()
    }
  }, [contributeFrom])

  return (
    <FormProvider {...contributeFrom}>
      {isContribute && <ContributeTipis />}
      <PublishConfig />
      <TagController isContribute={isContribute} tipisID={tipisID} />
      <Actions
        isContribute={isContribute}
        tipisID={tipisID}
        contributeCallback={contributeCallback}
      />
    </FormProvider>
  )
}

export default ContributeTipisModalContent
