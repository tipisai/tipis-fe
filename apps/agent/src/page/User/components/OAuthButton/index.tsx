import { Button } from "antd"
import { FC, useState } from "react"
import { useSearchParams } from "react-router-dom"
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
