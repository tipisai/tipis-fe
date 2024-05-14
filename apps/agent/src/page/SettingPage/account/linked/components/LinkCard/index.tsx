import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { LinkCardProps } from "./interface"
import {
  buttonWrapperStyle,
  containerStyle,
  descriptionStyle,
  headerContainerStyle,
  iconContainerStyle,
  titleContainerStyle,
  titleStyle,
} from "./style"

export const LinkCard: FC<LinkCardProps> = (props) => {
  const { icon, title, description, handleClick, isConnected } = props
  const { t } = useTranslation()

  return (
    <div css={containerStyle}>
      <div css={headerContainerStyle}>
        <div css={titleContainerStyle}>
          <span css={iconContainerStyle}>{icon}</span>
          <span css={titleStyle}>{title}</span>
        </div>
        <span css={descriptionStyle}>{description}</span>
      </div>
      <span css={buttonWrapperStyle}>
        {isConnected ? (
          <Button size="large" onClick={handleClick}>
            {t("profile.setting.oauth.button.disconnect")}
          </Button>
        ) : (
          <Button type="primary" size="large" onClick={handleClick}>
            {t("profile.setting.oauth.button.connect")}
          </Button>
        )}
      </span>
    </div>
  )
}
