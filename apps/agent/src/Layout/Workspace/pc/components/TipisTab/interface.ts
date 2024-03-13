import { TAB_TYPE } from "@/redux/ui/recentTab/interface"

export interface ITipsTab {
  icon: string
  tabType: TAB_TYPE
  tabName: string
  tabID: string
  cacheID: string
}
