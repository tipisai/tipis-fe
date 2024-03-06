import { setAuthToken } from "@illa-public/utils"
import { LoaderFunctionArgs } from "react-router-dom"

export const saveTokenToLocalStorageLoader = (args: LoaderFunctionArgs) => {
  const { request } = args
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const token = url.searchParams.get("token")
  if (token) {
    setAuthToken(token)
    searchParams.delete("token")
    url.search = searchParams.toString()
    window.history.replaceState(null, "", url.toString())
  }
  return null
}
