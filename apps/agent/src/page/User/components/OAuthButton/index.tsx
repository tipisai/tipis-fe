import { Button } from "antd"
import { FC, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  ILLAMixpanel,
  ILLA_MIXPANEL_EVENT_TYPE,
  ILLA_MIXPANEL_PUBLIC_PAGE_NAME,
} from "@illa-public/mixpanel-utils"
import {
  OAUTH_REDIRECT_URL,
  openOAuthUrl,
  useLazyGetOAuthURIQuery,
} from "@illa-public/user-data"
import { OAuthButtonProps } from "./interface"

export const OAuthButton: FC<OAuthButtonProps> = (props) => {
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign"]
  const [triggerGetOAuthURIQuery] = useLazyGetOAuthURIQuery()

  const onClickButton = async () => {
    ILLAMixpanel.track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      page: ILLA_MIXPANEL_PUBLIC_PAGE_NAME.LOGIN,
      element: `${props.type}_sign_in`,
    })

    const targetURL = new URL(OAUTH_REDIRECT_URL)
    searchParams.forEach((value, key) => {
      if (utmKeys.includes(key)) {
        targetURL.searchParams.set(key, value)
      }
    })
    targetURL.searchParams.set(
      "redirectURL",
      searchParams.get("redirectURL") ?? "",
    )

    try {
      setLoading(true)
      const response = await triggerGetOAuthURIQuery({
        oauthAgency: props.type,
        landing: props.landing,
        redirectURI: targetURL.toString(),
      }).unwrap()

      openOAuthUrl(response.uri)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(true)
    }
  }

  return (
    <Button
      icon={props.icon}
      shape={props.isMobile ? "circle" : "default"}
      size="large"
      block={props.isMobile ? false : true}
      onClick={onClickButton}
      loading={loading}
    >
      {props.children}
    </Button>
  )
}
