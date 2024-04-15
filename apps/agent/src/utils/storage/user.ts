import { CurrentUserInfo } from "@illa-public/public-types"
import { TIPISStorage } from "."

export const setSessionCurrentUserInfo = (userInfo: CurrentUserInfo) => {
  TIPISStorage.setSessionStorage("userInfo", userInfo)
}

export const getSessionCurrentUserInfo = () => {
  return TIPISStorage.getSessionStorage("userInfo") as
    | CurrentUserInfo
    | undefined
}
