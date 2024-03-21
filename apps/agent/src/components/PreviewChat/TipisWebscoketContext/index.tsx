import { App } from "antd"
import {
  FC,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import WebSocketClient from "@illa-public/illa-web-socket"
import {
  WooModalType,
  handleWooPurchaseError,
} from "@illa-public/upgrade-modal"
import { getAuthToken } from "@illa-public/utils"
import { getTextMessagePayload } from "@/api/ws"
import { Callback, ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal, TextTarget } from "@/api/ws/textSignal"
import {
  IInitWSCallback,
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

  const [wsStatus, setWSStatus] = useState<ILLA_WEBSOCKET_STATUS>(
    ILLA_WEBSOCKET_STATUS.INIT,
  )

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
      setWSStatus(ILLA_WEBSOCKET_STATUS.INIT)
    }
  }, [])

  const connect = useCallback(
    async (callbackOptions: IInitWSCallback) => {
      if (tipisWSClient.current) return
      const {
        onReceiving,
        onConnecting,
        onMessageFailedCallback,
        onMessageSuccessCallback,
        address,
      } = callbackOptions
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
            setWSStatus(ILLA_WEBSOCKET_STATUS.CONNECTED)
          },
          onClose: () => {
            setWSStatus(ILLA_WEBSOCKET_STATUS.CLOSED)
            onReceiving(true)
          },
          onError: () => {
            setWSStatus(ILLA_WEBSOCKET_STATUS.FAILED)
          },
          onMessage: (data) => {
            let callback: Callback<unknown> = JSON.parse(data)
            if (callback.errorCode === 0) {
              onMessageSuccessCallback(callback)
            } else {
              onMessageFailedCallback(callback)
            }
          },
        })
      } catch (e) {
        const res = handleWooPurchaseError(e, WooModalType.TOKEN, "agent_run")
        if (res) return
        messageAPI.error({
          content: t("editor.ai-agent.message.start-failed"),
        })
      }
    },
    [messageAPI, t],
  )

  const value = useMemo(
    () => ({
      connect,
      sendMessage,
      leaveRoom,
      wsStatus,
    }),
    [connect, leaveRoom, sendMessage, wsStatus],
  )

  return (
    <TipisWebSocketContext.Provider value={value}>
      {children}
    </TipisWebSocketContext.Provider>
  )
}
