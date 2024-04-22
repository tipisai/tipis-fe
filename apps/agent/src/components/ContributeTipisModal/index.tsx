import { Modal } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import ContributeTipis from "./components/ContributeTipis"
import PublishConfig from "./components/PublishConfig"

const ContributeTipisModal: FC = () => {
  const { t } = useTranslation()
  return (
    <Modal title={t("homepage.contribute_modal.contribute")} open>
      <ContributeTipis />
      <PublishConfig />
    </Modal>
  )
}

export default ContributeTipisModal
