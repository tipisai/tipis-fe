import { List } from "antd"
import { FC, useState } from "react"
import CreateIntegration from "../CreateIntegration"
import SelectIntegrationFooter from "./components/Footer"
import { ISelectIntegrationProps, SELECT_INTEGRATION_STEP } from "./interface"

const SelectIntegration: FC<ISelectIntegrationProps> = (props) => {
  const { onConfirm, integrationType } = props
  const [step, setStep] = useState<SELECT_INTEGRATION_STEP>(
    SELECT_INTEGRATION_STEP.SELECT,
  )
  const [selectedIntegration, setSelectedIntegration] = useState<string>("")
  return (
    <>
      {step === SELECT_INTEGRATION_STEP.SELECT && (
        <>
          <List />
          <SelectIntegrationFooter
            onCreateIntegration={() => {
              setStep(SELECT_INTEGRATION_STEP.CREATE)
            }}
            selectedIntegration={selectedIntegration}
            onConfirm={onConfirm}
          />
        </>
      )}
      {step === SELECT_INTEGRATION_STEP.CREATE && (
        <CreateIntegration
          onBack={() => {
            setStep(SELECT_INTEGRATION_STEP.SELECT)
          }}
          onConfirm={onConfirm}
          integrationType={integrationType}
        />
      )}
    </>
  )
}

export default SelectIntegration
