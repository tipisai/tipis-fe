import { FC } from "react"
import { useTranslation } from "react-i18next"
import { CommentIcon } from "@illa-public/icon"
import {
  applyItemStyle,
  iconStyle,
  nameStyle,
  titleContainerStyle,
} from "./style"

export const SuggestResourceCard: FC = () => {
  const { t } = useTranslation()

  const handleClickTellUs = () => {
    window.open("https://forms.gle/ngEoRvBtWvrTuWDNA", "_blank")
  }
  return (
    <a css={applyItemStyle} onClick={handleClickTellUs}>
      <CommentIcon css={iconStyle} />
      <div css={titleContainerStyle}>
        <div css={nameStyle}>{t("editor.action.form.option.tell_us")}</div>
      </div>
    </a>
  )
}

SuggestResourceCard.displayName = "SuggestResourceCard"
