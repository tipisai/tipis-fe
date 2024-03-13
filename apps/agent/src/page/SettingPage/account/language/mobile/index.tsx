import { Button, Select } from "antd"
import { FC, useContext, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import SettingMobileLayout from "@/page/SettingPage/layout/mobile"
import { useLangOptions } from "../hook"
import { LanguageSettingMobileProps } from "./interface"
import {
  controllerContainerStyle,
  mobileContainerStyle, // mobileSelectStyle,
} from "./style"

const MobileLanguageSetting: FC<LanguageSettingMobileProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, loading, language, currentLanguage, onChangeLanguage } =
    props

  const buttonDisabled = language === currentLanguage
  const LANG_OPTIONS = useLangOptions()
  const { track } = useContext(MixpanelTrackContext)

  useEffect(() => {
    track(ILLA_MIXPANEL_EVENT_TYPE.SHOW, { element: "language" })
  }, [track])

  useEffect(() => {
    track(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
      element: "save_change",
      parameter2: "language",
      parameter3: buttonDisabled ? "disable" : "not_disable",
    })
  }, [buttonDisabled, track])

  return (
    <SettingMobileLayout>
      <div css={mobileContainerStyle}>
        <section
          onClick={(e) => {
            if ((e.target as HTMLElement).nodeName !== "INPUT") return
            track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
              element: "language",
              parameter2: currentLanguage,
            })
          }}
          css={controllerContainerStyle}
        >
          <label>{t("profile.setting.language")}</label>
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
        </section>
        <Button
          type="primary"
          size="large"
          disabled={buttonDisabled}
          loading={loading}
          block
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
      </div>
    </SettingMobileLayout>
  )
}

MobileLanguageSetting.displayName = "LanguageSettingMobile"

export default MobileLanguageSetting
