import { TIntegrationType } from "@illa-public/public-types"

export enum AI_TOOL_TYPE {
  FUNCTION = 1,
}

export interface IAIToolParametersDTO {
  name: string
  description: string
  type: string
  isEnum: boolean
  enum: string[]
  required: boolean
  children: IAIToolParametersDTO[]
}

export interface IEditedByDTO {
  userID: string
  nickname: string
  avatar: string
  email: string
  editedAt: string
}

export interface IAIToolDTO<T> {
  aiToolID: string
  uid: string
  teamID: string
  resourceID: string
  resourceType: TIntegrationType
  name: string
  description: string
  toolType: AI_TOOL_TYPE
  parameters: IAIToolParametersDTO[]
  config: {
    icon: string
  }
  content: T
  publishedToMarketplace: boolean
  createBy: string
  createAt: string
  updatedBy: string
  updatedAt: string
  editedBy: IEditedByDTO[]
}

export interface IGetAllAIToolsListResponseDTO {
  aiToolList: IAIToolDTO<unknown>[]
  totalAIToolCount: number
}

export interface ICreateOrUpdateAIToolRequestDTO<T> {
  resourceID: string
  resourceType: TIntegrationType
  name: string
  description: string
  toolType: AI_TOOL_TYPE
  parameters: IAIToolParametersDTO[]
  config: {
    icon: string
  }
  content: T
}
