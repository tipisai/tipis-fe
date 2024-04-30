import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { UnPinIcon } from "@illa-public/icon"
import NotHasTipIcon from "@/assets/workspace/not-has-tipi.svg?react"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import { useRemovePinedTipiTabByTipiIDReducer } from "@/utils/pinedTabs/baseHook"
import { useRemoveRecentTabByCacheIDReducer } from "@/utils/recentTabs/baseHook"
import { useNavigateToNewChat } from "@/utils/routeHelper/hook"
import { IEmptyTipisProps } from "./interface"
import {
  emptyOuterContainerStyle,
  emptyTipisContainerStyle,
  emptyTipisTipTextStyle,
} from "./style"

const EmptyTipis: FC<IEmptyTipisProps> = (props) => {
  const { tipisID } = props
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const pinedTipis = useSelector((state) =>
    getPinedTipisByTipisID(state, tipisID),
  )

  const navigateToDefaultChat = useNavigateToNewChat()
  const removePinedByTipiID = useRemovePinedTipiTabByTipiIDReducer()
  const removeAllRecentTabsByTipisID = useRemoveRecentTabByCacheIDReducer()

  const isPined = !!pinedTipis

  const handleClickedButton = async () => {
    setIsLoading(true)
    if (isPined) {
      await removePinedByTipiID(tipisID)
    }
    await removeAllRecentTabsByTipisID(tipisID)

    await navigateToDefaultChat(DEFAULT_CHAT_ID)
    setIsLoading(false)
  }

  return (
    <div css={emptyOuterContainerStyle}>
      <div css={emptyTipisContainerStyle}>
        <NotHasTipIcon />
        <p css={emptyTipisTipTextStyle}>
          {t("homepage.tipi_chat.error_page.desc")}
        </p>
        <Button
          loading={isLoading}
          icon={isPined ? <Icon component={UnPinIcon} /> : undefined}
          onClick={handleClickedButton}
        >
          {isPined
            ? t("homepage.tipi_chat.error_page.button")
            : t("homepage.tipi_chat.error_page.button2")}
        </Button>
      </div>
    </div>
  )
}

export default EmptyTipis
