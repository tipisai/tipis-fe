import { TIntegrationType } from "@illa-public/public-types"

export interface BaseConfigElementProps {
  integrationID?: string
}

export interface ConfigElementProps extends BaseConfigElementProps {
  integrationType?: TIntegrationType
}
