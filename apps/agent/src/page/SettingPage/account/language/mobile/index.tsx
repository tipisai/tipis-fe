import { Button, Select } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useLangOptions } from "../hook"
import { LanguageSettingMobileProps } from "./interface"
import { controllerContainerStyle, mobileContainerStyle } from "./style"

const MobileLanguageSetting: FC<LanguageSettingMobileProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, loading, language, currentLanguage, onChangeLanguage } =
    props

  const buttonDisabled = language === currentLanguage
  const LANG_OPTIONS = useLangOptions()

  return (
    <div css={mobileContainerStyle}>
      <section css={controllerContainerStyle}>
        <label>{t("profile.setting.language")}</label>
        <Select
          value={currentLanguage}
          size="large"
          options={LANG_OPTIONS}
          onChange={(value) => {
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
        }}
      >
        {t("profile.setting.save")}
      </Button>
    </div>
  )
}

MobileLanguageSetting.displayName = "LanguageSettingMobile"

export default MobileLanguageSetting
