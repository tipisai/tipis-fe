import { IUserInfoVO } from "@illa-public/public-types"
import { TIPISStorage } from "."

export const setSessionCurrentUserInfo = (userInfo: IUserInfoVO) => {
  TIPISStorage.setSessionStorage("userInfo", userInfo)
}

export const getSessionCurrentUserInfo = () => {
  return TIPISStorage.getSessionStorage("userInfo") as IUserInfoVO | undefined
}
