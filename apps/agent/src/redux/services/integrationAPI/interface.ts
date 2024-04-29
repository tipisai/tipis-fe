import { TIntegrationType } from "@illa-public/public-types"

export interface IIntegrationDTO<T> {
  resourceID: string
  resourceName: string
  resourceType: TIntegrationType
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  content: T
}
