import { Button, Select } from "antd"
import { FC, useContext, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { Header } from "@/page/SettingPage/components/Header"
import { useLangOptions } from "../hook"
import { LanguageSettingProps } from "./interface"
import {
  containerStyle,
  formFieldStyle,
  formTitleStyle,
  innerContainerStyle,
} from "./style"

const PCLanguageSetting: FC<LanguageSettingProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, loading, language, currentLanguage, onChangeLanguage } =
    props

  const buttonDisabled = language === currentLanguage
  const LANG_OPTIONS = useLangOptions()
  const { track } = useContext(MixpanelTrackContext)

  useEffect(() => {
    track(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
      element: "save_change",
      parameter2: "language",
      parameter3: buttonDisabled ? "disable" : "not_disable",
    })
  }, [buttonDisabled, track])

  return (
    <>
      <Header title={t("profile.setting.language")} />
      <div css={containerStyle}>
        <div css={innerContainerStyle}>
          <header css={formTitleStyle}>{t("profile.setting.language")}</header>
          <div
            css={formFieldStyle}
            onClick={(e) => {
              if ((e.target as HTMLElement).nodeName !== "INPUT") return
              track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
                element: "language",
                parameter2: currentLanguage,
              })
            }}
          >
            <Select
              value={currentLanguage}
              size="large"
              options={LANG_OPTIONS}
              onChange={(value) => {
                track(ILLA_MIXPANEL_EVENT_TYPE.CHANGE, {
                  element: "language",
                  parameter2: value,
                })
                onChangeLanguage(value as string)
              }}
            />
            <span>
              <Button
                type="primary"
                size="large"
                disabled={buttonDisabled}
                loading={loading}
                onClick={() => {
                  onSubmit()
                  track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
                    element: "save_change",
                    parameter1: "language",
                  })
                }}
              >
                {t("profile.setting.save")}
              </Button>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

PCLanguageSetting.displayName = "LanguageSetting"

export default PCLanguageSetting
