import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { MobileForbidden } from "@illa-public/status-page"
import ProtectedComponent from "@/components/Auth"
import { RoutesObjectPro } from "./interface"
import { saveTokenToLocalStorageLoader } from "./loader/beautifyURLLoader"

export const buildRouter = (config: RoutesObjectPro[]) => {
  return config.map((route) => {
    const {
      element,
      children,
      needLogin,
      loader: originLoader,
      needRole,
      ...otherRouterParams
    } = route
    const newRouteItem: RoutesObjectPro = {
      ...otherRouterParams,
      element,
      loader: originLoader,
    }
    if (!newRouteItem.accessByMobile) {
      newRouteItem.element = (
        <LayoutAutoChange
          desktopPage={element}
          mobilePage={<MobileForbidden />}
        />
      )
    }
    if (needLogin) {
      newRouteItem.loader = async (args) => {
        // check login
        const saveTokenLoader = saveTokenToLocalStorageLoader(args)
        if (saveTokenLoader) {
          return saveTokenLoader
        }
        return originLoader?.(args) || null
      }
      newRouteItem.element = (
        <ProtectedComponent needRole={needRole}>
          {newRouteItem.element}
        </ProtectedComponent>
      )
    }

    if (Array.isArray(children) && children.length) {
      newRouteItem.children = buildRouter(children)
    }
    return newRouteItem
  })
}
