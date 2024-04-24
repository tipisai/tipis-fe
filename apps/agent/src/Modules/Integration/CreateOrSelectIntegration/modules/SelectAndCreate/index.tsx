import { FC, useState } from "react"
import CreateIntegration from "../CreateIntegration"
import SelectIntegration from "../SelectIntegration"
import {
  ISelectAndCreateIntegrationProps,
  SELECT_INTEGRATION_STEP,
} from "./interface"

const SelectAndCreateIntegration: FC<ISelectAndCreateIntegrationProps> = (
  props,
) => {
  const { onConfirm, integrationType } = props
  const [step, setStep] = useState<SELECT_INTEGRATION_STEP>(
    SELECT_INTEGRATION_STEP.SELECT,
  )

  return (
    <>
      {step === SELECT_INTEGRATION_STEP.SELECT && (
        <SelectIntegration
          onClickCreate={() => {
            setStep(SELECT_INTEGRATION_STEP.CREATE)
          }}
          onConfirm={onConfirm}
        />
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

export default SelectAndCreateIntegration
