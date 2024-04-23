import { Modal } from "antd"
import { FC, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import Actions from "../components/Actions"
import ContributeTipis from "../components/ContributeTipis"
import PublishConfig from "../components/PublishConfig"
import TagController from "../components/TagController"
import { IContributeFromFields, IContributeTipisModalProps } from "./interface"

const ContributeTipisModal: FC<IContributeTipisModalProps> = ({
  isContribute,
  tipisID,
  contributeCallback,
  visible,
  closeModal,
}) => {
  const { t } = useTranslation()
  const { data } = useGetAIAgentMarketplaceInfoQuery(
    { aiAgentID: tipisID },
    {
      skip: !isContribute || !visible,
    },
  )

  const contributeFrom = useForm<IContributeFromFields>({
    values: {
      contributeToMarketplace: isContribute,
      publishConfiguration:
        data?.marketplace?.config?.publishConfiguration ?? false,
      hashtags: data?.marketplace?.hashtags ?? [],
    } as IContributeFromFields,
  })

  useEffect(() => {
    return () => {
      contributeFrom.reset()
    }
  }, [contributeFrom])

  return (
    <Modal
      title={t("homepage.contribute_modal.contribute")}
      footer={null}
      closable
      open={visible}
      onCancel={closeModal}
      destroyOnClose
      width="520px"
      style={{
        padding: 0,
      }}
    >
      <FormProvider {...contributeFrom}>
        {isContribute && <ContributeTipis />}
        <PublishConfig />
        <TagController isContribute={isContribute} />
        <Actions
          isContribute={isContribute}
          tipisID={tipisID}
          contributeCallback={contributeCallback}
        />
      </FormProvider>
    </Modal>
  )
}

export default ContributeTipisModal
