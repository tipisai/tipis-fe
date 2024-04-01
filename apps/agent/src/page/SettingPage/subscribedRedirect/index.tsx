import { FC, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import SuccessBg from "@/assets/subscribeRedirect/success-bg.svg"
import BlackButton from "@/components/BlackButton"
import {
  actionAreaStyle,
  containerStyle,
  decorateStyle,
  descriptionStyle,
  headerStyle,
  subscribedContentStyle,
  titleStyle,
} from "./style"

const RETURN_COUNTER = 3

const SubscribedLanding: FC = () => {
  const { t } = useTranslation()
  const [counter, setCounter] = useState(RETURN_COUNTER)
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get("returnTo")

  useEffect(() => {
    if (!returnTo) return

    const timer = setTimeout(() => {
      if (counter > 0) {
        setCounter(counter - 1)
      } else {
        window.location.href = returnTo
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [counter, returnTo])

  return (
    <>
      <Helmet>
        <title> {t("billing.redirect_page.title")}</title>
      </Helmet>
      <div css={containerStyle}>
        <div css={subscribedContentStyle}>
          <img src={SuccessBg} css={decorateStyle} />
          <div css={headerStyle}>
            <div css={titleStyle}>{t("billing.redirect_page.title")}</div>
            <div css={descriptionStyle}>
              {t("billing.redirect_page.desc1")}
              {returnTo && (
                <p>{t("billing.redirect_page.desc2", { time: counter })}</p>
              )}
            </div>
          </div>
          <div css={actionAreaStyle}>
            <BlackButton
              type="primary"
              size="large"
              onClick={() => {
                window.location.href =
                  returnTo ?? `${window.location.origin}/workspace`
              }}
            >
              {t("billing.redirect_page.button")}
            </BlackButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubscribedLanding
