import { useCallback } from "react"
import { getAuthToken } from "@illa-public/utils"

export const useRedirectToRedirectURL = () => {
  const redirect = useCallback((redirectURL: string) => {
    let parseRedirectURL = new URL(decodeURIComponent(redirectURL))
    parseRedirectURL.searchParams.set("token", getAuthToken()!)
    window.location.href = parseRedirectURL.toString()
  }, [])

  return redirect
}
