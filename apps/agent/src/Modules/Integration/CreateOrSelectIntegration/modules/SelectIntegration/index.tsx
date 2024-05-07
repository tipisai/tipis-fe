import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useIntegrationSelectorContext } from "../../utils"
import SelectIntegrationFooter from "./components/Footer"
import IntegrationList from "./components/List"
import { ISelectIntegrationProps } from "./interface"

const SelectIntegration: FC<ISelectIntegrationProps> = (props) => {
  const { onClickCreate, onConfirm, integrationType } = props
  const [selectedIntegration, setSelectedIntegration] = useState<string>("")
  const { setModalName } = useIntegrationSelectorContext()
  const { t } = useTranslation()

  useEffect(() => {
    setModalName(t("editor.action.modal.select_integration"))
  }, [setModalName, t])

  return (
    <>
      <IntegrationList
        onClickItem={setSelectedIntegration}
        selectedIntegrationID={selectedIntegration}
        integrationType={integrationType}
      />
      <SelectIntegrationFooter
        onCreateIntegration={onClickCreate}
        selectedIntegration={selectedIntegration}
        onConfirm={onConfirm}
      />
    </>
  )
}

export default SelectIntegration
