import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { MobileForbidden } from "@illa-public/status-page"
import { RoutesObjectPro } from "./interface"

export const buildRouter = (config: RoutesObjectPro[]) => {
  return config.map((route) => {
    const {
      element,
      children,
      ProtectComponent,
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

    newRouteItem.loader = async (args) => {
      // check login
      // const saveTokenLoader = saveTokenToLocalStorageLoader(args)
      // if (saveTokenLoader) {
      //   return saveTokenLoader
      // }

      return typeof originLoader === "function"
        ? originLoader?.(args)
        : typeof originLoader === "boolean"
          ? originLoader
          : null
    }
    ProtectComponent &&
      (newRouteItem.element = (
        <ProtectComponent needRole={needRole}>
          {newRouteItem.element}
        </ProtectComponent>
      ))

    if (Array.isArray(children) && children.length) {
      newRouteItem.children = buildRouter(children)
    }
    return newRouteItem
  })
}
