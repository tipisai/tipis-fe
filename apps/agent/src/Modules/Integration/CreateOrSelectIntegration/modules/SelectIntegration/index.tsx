import { FC, useEffect, useState } from "react"
import { useIntegrationSelectorContext } from "../../utils"
import SelectIntegrationFooter from "./components/Footer"
import IntegrationList from "./components/List"
import { ISelectIntegrationProps } from "./interface"

const SelectIntegration: FC<ISelectIntegrationProps> = (props) => {
  const { onClickCreate, onConfirm } = props
  const [selectedIntegration, setSelectedIntegration] = useState<string>("")
  const { setModalName } = useIntegrationSelectorContext()

  useEffect(() => {
    setModalName("select")
  }, [setModalName])

  return (
    <>
      <IntegrationList
        onClickItem={setSelectedIntegration}
        selectedIntegrationID={selectedIntegration}
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
