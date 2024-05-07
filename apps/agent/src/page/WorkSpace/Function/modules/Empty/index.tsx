import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import NotHasTipIcon from "@/assets/workspace/not-has-tipi.svg?react"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import { useRemoveRecentTabByCacheIDReducer } from "@/utils/recentTabs/baseHook"
import { useNavigateToNewChat } from "@/utils/routeHelper/hook"
import { IEmptyDetailProps } from "./interface"
import {
  emptyOuterContainerStyle,
  emptyTipisContainerStyle,
  emptyTipisTipTextStyle,
} from "./style"

const EmptyDetail: FC<IEmptyDetailProps> = (props) => {
  const { functionID } = props
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const navigateToDefaultChat = useNavigateToNewChat()
  const removeAllRecentTabsByTipisID = useRemoveRecentTabByCacheIDReducer()

  const handleClickedButton = async () => {
    setIsLoading(true)

    await removeAllRecentTabsByTipisID(functionID)

    await navigateToDefaultChat(DEFAULT_CHAT_ID)
    setIsLoading(false)
  }

  return (
    <div css={emptyOuterContainerStyle}>
      <div css={emptyTipisContainerStyle}>
        <NotHasTipIcon />
        <p css={emptyTipisTipTextStyle}>
          {t("homepage.function_dashboard.deleted")}
        </p>
        <Button loading={isLoading} onClick={handleClickedButton}>
          {t("homepage.tipi_chat.error_page.button2")}
        </Button>
      </div>
    </div>
  )
}

export default EmptyDetail
