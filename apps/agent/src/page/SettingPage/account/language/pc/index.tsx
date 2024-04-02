import { Button, Select } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
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

  return (
    <>
      <Header title={t("profile.setting.language")} />
      <div css={containerStyle}>
        <div css={innerContainerStyle}>
          <header css={formTitleStyle}>{t("profile.setting.language")}</header>
          <div css={formFieldStyle}>
            <Select
              value={currentLanguage}
              size="large"
              options={LANG_OPTIONS}
              onChange={(value) => {
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
