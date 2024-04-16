import { ITabInfo } from "@/redux/ui/recentTab/interface"

export function isTipisTabData(data: unknown): data is ITabInfo {
  return (
    typeof data === "object" &&
    data !== null &&
    "tabID" in data &&
    typeof data.tabID === "string"
  )
}
