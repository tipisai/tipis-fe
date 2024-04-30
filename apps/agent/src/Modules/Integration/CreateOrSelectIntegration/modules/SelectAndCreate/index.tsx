import { FC, useState } from "react"
import CreateIntegration from "../CreateOrUpdateIntegration/createIntegration"
import EditIntegrationDataProvider from "../CreateOrUpdateIntegration/editIntegration"
import SelectIntegration from "../SelectIntegration"
import {
  ISelectAndCreateIntegrationProps,
  SELECT_INTEGRATION_STEP,
} from "./interface"

const SelectAndCreateIntegration: FC<ISelectAndCreateIntegrationProps> = (
  props,
) => {
  const {
    onConfirm,
    integrationType,
    integrationID,
    defaultStep = SELECT_INTEGRATION_STEP.SELECT_OR_CREATE,
  } = props
  const [step, setStep] = useState<SELECT_INTEGRATION_STEP>(defaultStep)

  return (
    <>
      {step === SELECT_INTEGRATION_STEP.SELECT_OR_CREATE && (
        <SelectIntegration
          onClickCreate={() => {
            setStep(SELECT_INTEGRATION_STEP.CREATE)
          }}
          onConfirm={onConfirm}
        />
      )}
      {step === SELECT_INTEGRATION_STEP.CREATE && (
        <CreateIntegration
          onConfirm={onConfirm}
          onBack={() => {
            setStep(SELECT_INTEGRATION_STEP.SELECT_OR_CREATE)
          }}
          integrationType={integrationType}
        />
      )}
      {step === SELECT_INTEGRATION_STEP.EDIT &&
        (integrationID ? (
          <EditIntegrationDataProvider
            onConfirm={onConfirm}
            integrationID={integrationID}
          />
        ) : (
          <CreateIntegration
            onConfirm={onConfirm}
            integrationType={integrationType}
          />
        ))}
    </>
  )
}

export default SelectAndCreateIntegration
