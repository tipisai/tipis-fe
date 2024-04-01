import { LoaderFunctionArgs, redirect } from "react-router-dom"
import { setAuthToken } from "@illa-public/utils"
import { getUserInfoLoader } from "./authLoader"

export const rootLoader = async (args: LoaderFunctionArgs) => {
  const { request } = args
  const url = new URL(request.url)
  const inviteToken = url.searchParams.get("inviteToken")
  const paramsToken = url.searchParams.get("token")
  if (paramsToken) {
    setAuthToken(paramsToken)
  }

  const isLogin = await getUserInfoLoader()
  if (isLogin) {
    return null
  } else {
    if (inviteToken) {
      return redirect(`/user/register${url.search ?? ""}`)
    }
    return redirect(`/user/login${url.search ?? ""}`)
  }
}
