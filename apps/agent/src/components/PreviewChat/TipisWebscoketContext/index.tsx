import { App } from "antd"
import { FC, createContext, useCallback, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import WebSocketClient, { WS_READYSTATE } from "@illa-public/illa-web-socket"
import {
  CreditModalType,
  handleCreditPurchaseError,
} from "@illa-public/upgrade-modal"
import { getAuthToken } from "@illa-public/utils"
import { getTextMessagePayload } from "@/api/ws"
import { Callback } from "@/api/ws/interface"
import { TextSignal, TextTarget } from "@/api/ws/textSignal"
import {
  IInitWSCallback,
  SEND_MESSAGE_WS_TYPE,
  TipisWebSocketContextType,
  TipisWebSocketProviderProps,
} from "./interface"

export const TipisWebSocketContext = createContext<TipisWebSocketContextType>(
  {} as TipisWebSocketContextType,
)

export const TipisWebSocketProvider: FC<TipisWebSocketProviderProps> = (
  props,
) => {
  const { children } = props

  const tipisWSClient = useRef<WebSocketClient | null>(null)
  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()

  const sendMessage = useCallback(function (message: string) {
    tipisWSClient.current?.sendMessage(message)
  }, [])

  const leaveRoom = useCallback(() => {
    if (tipisWSClient.current && tipisWSClient.current.getWebSocket().OPEN) {
      tipisWSClient.current?.sendMessage(
        getTextMessagePayload(
          TextSignal.LEAVE,
          TextTarget.NOTHING,
          false,
          {
            type: "leave",
            payload: [],
          },
          "",
          "",
          [],
        ),
      )
      tipisWSClient.current?.close()
      tipisWSClient.current = null
    }
  }, [])

  const cleanMessage = useCallback(() => {
    if (tipisWSClient.current && tipisWSClient.current.getWebSocket().OPEN) {
      tipisWSClient.current?.sendMessage(
        getTextMessagePayload(
          TextSignal.CLEAN_CHAT_HISTORY,
          TextTarget.ACTION,
          false,
          {
            type: SEND_MESSAGE_WS_TYPE.CLEAN,
            payload: [],
          },
          "",
          "",
          [],
        ),
      )
    }
  }, [])

  const connect = useCallback(
    async (callbackOptions: IInitWSCallback) => {
      if (tipisWSClient.current) return
      const { onConnecting, onMessageCallBack, onCloseCallback, address } =
        callbackOptions
      onConnecting(true)
      try {
        tipisWSClient.current = new WebSocketClient(address, {
          onOpen: () => {
            tipisWSClient.current!.sendMessage(
              getTextMessagePayload(
                TextSignal.ENTER,
                TextTarget.NOTHING,
                false,
                {
                  type: "enter",
                  payload: [],
                },
                "",
                "",
                [
                  {
                    authToken: getAuthToken(),
                  },
                ],
              ),
            )
          },
          onMessage: (data) => {
            let callback: Callback<unknown> = JSON.parse(data)
            onMessageCallBack(callback)
          },
          onClose() {
            onCloseCallback()
          },
        })
      } catch (e) {
        const res = handleCreditPurchaseError(e, CreditModalType.TOKEN)
        if (res) return
        messageAPI.error({
          content: t("editor.ai-agent.message.start-failed"),
        })
      }
    },
    [messageAPI, t],
  )

  const getReadyState = useCallback(() => {
    if (tipisWSClient.current) {
      return tipisWSClient.current?.getReadyState()
    }
    return WS_READYSTATE.UNINITIALIZED
  }, [])

  const value = useMemo(
    () => ({
      connect,
      sendMessage,
      leaveRoom,
      cleanMessage,
      getReadyState,
    }),
    [connect, leaveRoom, sendMessage, cleanMessage, getReadyState],
  )

  return (
    <TipisWebSocketContext.Provider value={value}>
      {children}
    </TipisWebSocketContext.Provider>
  )
}
