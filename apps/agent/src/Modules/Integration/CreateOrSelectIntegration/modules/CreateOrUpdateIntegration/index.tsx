import { FC } from "react"
import CreateIntegration from "./createIntegration"
import EditIntegrationDataProvider from "./editIntegration"
import { ICreateOrEditIntegrationProps } from "./interface"

const CreateOrUpdateIntegration: FC<ICreateOrEditIntegrationProps> = (
  props,
) => {
  const { onConfirm, onBack, integrationID, integrationType } = props

  return integrationID ? (
    <EditIntegrationDataProvider
      onConfirm={onConfirm}
      integrationID={integrationID}
    />
  ) : (
    <CreateIntegration
      onConfirm={onConfirm}
      onBack={onBack}
      integrationType={integrationType}
    />
  )
}

export default CreateOrUpdateIntegration
