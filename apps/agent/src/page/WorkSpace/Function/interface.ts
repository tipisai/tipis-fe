import {
  IFunctionInterface,
  ITencentCosFunction,
} from "@illa-public/public-types"

export interface IIntegrationInfo {
  resourceID: string
  resourceName: string
}

export interface ITencentCosFunctionForm
  extends Omit<ITencentCosFunction, "resourceID"> {
  integrationInfo: IIntegrationInfo
}

export interface ILarkBotFunctionForm
  extends Omit<IFunctionInterface, "resourceID"> {
  integrationInfo: IIntegrationInfo
}

export type IFunctionForm = ITencentCosFunctionForm | ILarkBotFunctionForm

export interface IEditFunctionProps {
  originData: IFunctionForm
  cacheData: IFunctionForm | undefined
}
