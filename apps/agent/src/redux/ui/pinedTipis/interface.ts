export interface IPinedTipiTabInfo {
  tabID: string
  tabName: string
  tabIcon: string
  tipiID: string
  tipiOwnerTeamIdentity: string
}

export type TPinedTipisTabState = IPinedTipiTabInfo[]

export interface IUpdatePinedTipiTabByTipisIDPayload {
  [tipisID: string]: Partial<IPinedTipiTabInfo>
}
