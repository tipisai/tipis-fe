import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import EmptyTeamIcon from "@/assets/workspace/emptyTeam.svg?react"
import { containerStyle, emptyIconStyle, textStyle } from "./style"

const EmptyFunctionContentMobile: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={containerStyle}>
      <Icon component={EmptyTeamIcon} css={emptyIconStyle} />
      <span css={textStyle}>
        {t("editor.action.form.title.general.no_function")}
      </span>
    </div>
  )
}

export default EmptyFunctionContentMobile
