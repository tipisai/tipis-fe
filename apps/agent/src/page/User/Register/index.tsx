import { App } from "antd"
import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  ILLA_MIXPANEL_PUBLIC_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import {
  useSendVerificationCodeToEmailMutation,
  useSignUpMutation,
} from "@illa-public/user-data"
import { sendTagEvent, setAuthToken } from "@illa-public/utils"
import { getLocalLanguage } from "@/i18n"
import { linkTrk, rdtSignUpTrk, twqTrk } from "@/utils/gaHelper"
import { LINKEDIN_CONVERSION_ID, TWITTER_ID } from "@/utils/gaHelper/constent"
import { track } from "@/utils/mixpanelHelper"
import { tempRootPath } from "@/utils/routeHelper"
import { TIPISStorage } from "@/utils/storage"
import { RegisterFields } from "../interface"
import { RegisterErrorMsg } from "./interface"
import { MobileRegister } from "./mobile"
import { PCRegister } from "./pc"

const RegisterPage: FC = () => {
  const [showCountDown, setShowCountDown] = useState(false)
  const { email } = useParams()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const [signUp] = useSignUpMutation()
  const [sendVerificationCodeToEmail] = useSendVerificationCodeToEmailMutation()

  const formProps = useForm<RegisterFields>({
    defaultValues: {
      isSubscribed: true,
      email: email ?? searchParams.get("email") ?? "",
    },
  })

  const navigate = useNavigate()
  const { message } = App.useApp()

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<RegisterErrorMsg>({
    email: "",
    verificationCode: "",
  })

  const onSubmit: SubmitHandler<RegisterFields> = async (data) => {
    const verificationToken = TIPISStorage.getSessionStorage(
      "verificationToken",
    ) as string
    const inviteToken = searchParams.get("inviteToken")
    const currentTime = new Date().getTime()
    try {
      setLoading(true)
      const res = await signUp({
        inviteToken,
        verificationToken,
        language: getLocalLanguage(),
        ...data,
      }).unwrap()
      sendTagEvent("sign_up", res.userID)
      linkTrk(LINKEDIN_CONVERSION_ID.SIGNUP)
      twqTrk(TWITTER_ID.SIGNUP, res.userID)
      rdtSignUpTrk(res.userID)
      track(
        ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
        ILLA_MIXPANEL_PUBLIC_PAGE_NAME.SIGNUP,
        {
          element: "sign_up",
          consume: new Date().getTime() - currentTime,
          parameter2: "suc",
          parameter3: true,
        },
      )
      const token = res.token
      if (!token) return
      message.success(t("page.user.sign_up.tips.success"))
      setAuthToken(token)
      searchParams.delete("inviteToken")
      // TODO: WTF, need add workspace
      // navigate(
      //   `/${searchParams.toString() ? "?" + searchParams.toString() : ""}`,
      // )
      navigate(tempRootPath(""))
    } catch (e) {
      if (isILLAAPiError(e)) {
        track(
          ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
          ILLA_MIXPANEL_PUBLIC_PAGE_NAME.SIGNUP,
          {
            element: "sign_up",
            consume: new Date().getTime() - currentTime,
            parameter2: "failed",
            parameter3: e?.data?.errorFlag,
          },
        )
        switch (e?.data?.errorFlag) {
          case ERROR_FLAG.ERROR_FLAG_EMAIL_HAS_BEEN_TAKEN:
            message.error(t("page.user.sign_up.error_message.email.registered"))
            break
          case ERROR_FLAG.ERROR_FLAG_VALIDATE_VERIFICATION_CODE_FAILED:
            track(
              ILLA_MIXPANEL_EVENT_TYPE.VALIDATE,
              ILLA_MIXPANEL_PUBLIC_PAGE_NAME.SIGNUP,
              {
                element: "send_code",
                parameter2: "failed",
                parameter3: "invalid_code",
              },
            )
            message.error(
              t("page.user.sign_up.error_message.verification_code.invalid"),
            )
            break
          default:
            message.error(t("page.user.sign_up.tips.fail"))
            break
        }
        switch (e.data.errorMessage) {
          case "duplicate email address":
            setErrorMsg({
              ...errorMsg,
              email: t("page.user.sign_up.error_message.email.registered"),
            })
            break
          case "invalid verification code":
            track(
              ILLA_MIXPANEL_EVENT_TYPE.VALIDATE,
              ILLA_MIXPANEL_PUBLIC_PAGE_NAME.SIGNUP,
              {
                element: "send_code",
                parameter2: "failed",
                parameter3: "invalid_code",
              },
            )
            setErrorMsg({
              ...errorMsg,
              verificationCode: t(
                "page.user.sign_up.error_message.verification_code.invalid",
              ),
            })
            break
          default:
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (email: string) => {
    try {
      await sendVerificationCodeToEmail({
        email,
        usage: "signup",
      })
    } catch (e) {}
  }
  return (
    <FormProvider {...formProps}>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_PUBLIC_PAGE_NAME.SIGNUP}
      >
        <LayoutAutoChange
          desktopPage={
            <PCRegister
              loading={loading}
              errorMsg={errorMsg}
              onSubmit={onSubmit}
              sendEmail={handleSendEmail}
              lockedEmail={email ?? searchParams.get("email") ?? ""}
              showCountDown={showCountDown}
              onCountDownChange={setShowCountDown}
            />
          }
          mobilePage={
            <MobileRegister
              loading={loading}
              errorMsg={errorMsg}
              onSubmit={onSubmit}
              sendEmail={handleSendEmail}
              lockedEmail={email ?? searchParams.get("email") ?? ""}
              showCountDown={showCountDown}
              onCountDownChange={setShowCountDown}
            />
          }
        />
      </MixpanelTrackProvider>
    </FormProvider>
  )
}

export default RegisterPage
