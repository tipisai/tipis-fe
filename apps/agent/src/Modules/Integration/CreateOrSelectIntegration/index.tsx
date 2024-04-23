import { FC } from "react"
import { ICreateOrSelectIntegrationProps } from "./interface"
import CreateIntegration from "./modules/CreateIntegration"
import SelectIntegration from "./modules/SelectIntegration"

const hasResource = true

const CreateOrSelectIntegration: FC<ICreateOrSelectIntegrationProps> = (
  props,
) => {
  const { onConfirm, integrationType } = props
  return hasResource ? (
    <SelectIntegration
      onConfirm={onConfirm}
      integrationType={integrationType}
    />
  ) : (
    <CreateIntegration
      onConfirm={onConfirm}
      integrationType={integrationType}
    />
  )
}

export default CreateOrSelectIntegration
