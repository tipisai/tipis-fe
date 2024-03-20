import store from "@/redux/store"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { DEFAULT_CHAT_ID, INIT_TABS } from "@/redux/ui/recentTab/state"
import { getTabs } from "@/utils/localForage/tabsStore"

export const workspaceLayoutLoader = async () => {
  const localCacheTabs = await getTabs()
  const cacheTabs =
    Array.isArray(localCacheTabs) && localCacheTabs.length > 0
      ? localCacheTabs
      : INIT_TABS
  store.dispatch(recentTabActions.initRecentTabReducer(cacheTabs))
  store.dispatch(
    recentTabActions.updateCurrentRecentTabIDReducer(DEFAULT_CHAT_ID),
  )

  return null
}
