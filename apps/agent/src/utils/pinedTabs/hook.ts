import { App } from "antd"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import store from "@/redux/store"
import {
  getPinedTipis,
  getPinedTipisByTipisID,
} from "@/redux/ui/pinedTipis/selector"
import {
  useAddPinedTipiTabReducer,
  useRemovePinedTipiTabByTipiIDReducer,
} from "./baseHook"

export const usePinOrUnpinTipis = () => {
  const addPinedTipis = useAddPinedTipiTabReducer()
  const removePinedTipiByTipisID = useRemovePinedTipiTabByTipiIDReducer()
  const currentPinedTips = useSelector(getPinedTipis)
  const { t } = useTranslation()
  const { message } = App.useApp()

  const pinOrUnpinTipis = useCallback(
    async (tipiInfo: {
      tipiID: string
      tipiName: string
      tipiIcon: string
      tipiOwnerTeamIdentity: string
    }) => {
      const { tipiID, tipiName, tipiIcon, tipiOwnerTeamIdentity } = tipiInfo
      const pinedTipisInfo = getPinedTipisByTipisID(store.getState(), tipiID)
      if (pinedTipisInfo) {
        await removePinedTipiByTipisID(tipiID)
      } else {
        if (currentPinedTips.length >= 20) {
          message.error({
            content: t("dashboard.common.pin_limited"),
          })
        } else {
          await addPinedTipis({
            tabID: v4(),
            tabName: tipiName,
            tabIcon: tipiIcon,
            tipiID,
            tipiOwnerTeamIdentity,
          })
        }
      }
    },
    [
      addPinedTipis,
      currentPinedTips.length,
      message,
      removePinedTipiByTipisID,
      t,
    ],
  )

  return pinOrUnpinTipis
}
