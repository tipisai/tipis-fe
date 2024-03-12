import store from "@/redux/store"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { getTabs } from "@/utils/localForage/tabsStore"

export const workspaceLayoutLoader = async () => {
  const cacheTabs = await getTabs()
  store.dispatch(recentTabActions.initRecentTabReducer(cacheTabs))

  return null
}
