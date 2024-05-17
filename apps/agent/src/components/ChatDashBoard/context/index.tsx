import {
  FC,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { SSE } from "sse.js"
import { getAuthToken } from "@illa-public/utils"
import { IChatWSProviderProps } from "@/page/WorkSpace/Chat/context/interface"
import {
  IAIMessageDTO,
  IFunctionMessageDTO,
  IHumanMessageDTO,
  IHumanMessageVO,
  IMessageCycleVO,
  IMessageFileVO,
  IReceiveMessageDTO,
  MESSAGE_ROLE_TYPE,
  READYSTATE,
} from "../interface"
import {
  IChatStableWSInject,
  IChatUnStableWSInject,
  ICustomSSEResponse,
} from "./interface"
import { handleReceiveMessage } from "./utils"

const SSE_URL = "https://chatapi.tipis.ai/chat"

export const ChatStableWSContext = createContext({} as IChatStableWSInject)
export const ChatUnStableWSContext = createContext({} as IChatUnStableWSInject)

export const ChatWSProvider: FC<IChatWSProviderProps> = (props) => {
  const { children } = props
  const sseSourceRef = useRef<SSE | null>(null)
  const [readyState, setReadyState] = useState<READYSTATE>(
    READYSTATE.INITIALIZING,
  )
  const [cycleMessageList, setCycleMessageList] = useState<IMessageCycleVO[]>(
    [],
  )

  const abortControllerRef = useRef<AbortController | null>(null)

  const [currentRenderCycle, setCurrentRenderCycle] =
    useState<IMessageCycleVO | null>(null)

  const cacheRenderCycle = useRef<IMessageCycleVO | null>(null)

  const handleCycleMessageEnd = useCallback(() => {
    if (!cacheRenderCycle.current) {
      return
    }
    const lastCycle = JSON.parse(JSON.stringify(cacheRenderCycle.current))
    setCycleMessageList((prev) => {
      if (Array.isArray(prev) && prev.length > 0) {
        return [...prev, lastCycle]
      }
      return [lastCycle]
    })
    cacheRenderCycle.current = null
    setCurrentRenderCycle(null)
  }, [])

  const handleInitCycleMessage = useCallback(
    (sendMessage: IHumanMessageDTO, fileList?: IMessageFileVO[]) => {
      const humanMessage: IHumanMessageVO = {
        type: MESSAGE_ROLE_TYPE.HUMAN,
        message_id: sendMessage.human_message_id,
        content: sendMessage.human_message,
        file_list: fileList,
      }
      cacheRenderCycle.current = {
        humanMessage,
        aiMessage: [],
      }
      setCurrentRenderCycle(cacheRenderCycle.current)
    },
    [],
  )

  const handleUpdateMessageCycleList = useCallback(
    (message: IAIMessageDTO | IFunctionMessageDTO) => {
      if (!cacheRenderCycle.current) {
        return
      } else {
        const currentCycle = handleReceiveMessage(
          message,
          cacheRenderCycle.current,
        )
        cacheRenderCycle.current = currentCycle
        setCurrentRenderCycle(currentCycle)
      }
    },
    [],
  )

  const handleClose = useCallback(() => {
    if (sseSourceRef.current) {
      sseSourceRef.current.close()
      sseSourceRef.current = null
    }
  }, [])

  const handleReadyStateChange = useCallback(
    (state: READYSTATE) => {
      setReadyState(state)
      if (state === READYSTATE.CLOSED) {
        handleCycleMessageEnd()
        handleClose()
      }
    },
    [handleClose, handleCycleMessageEnd],
  )

  const handleSendMessage = useCallback(
    (sendMessage: IHumanMessageDTO, sendFiles?: IMessageFileVO[]) => {
      if (sseSourceRef.current) {
        handleClose()
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()
      // handle init
      handleInitCycleMessage(sendMessage, sendFiles)
      const sseSource = new SSE(SSE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthToken(),
        },
        payload: JSON.stringify(sendMessage),
        method: "POST",
      })
      sseSource.onopen = () => {
        // handle start
      }

      sseSource.addEventListener("message", (event: ICustomSSEResponse) => {
        // handle message IAIMessageDTO
        const message = JSON.parse(event.data) as IReceiveMessageDTO
        if (message.type === MESSAGE_ROLE_TYPE.KNOWLEDGE_UPDATE) {
          // handle memery
        } else if (
          message.type === MESSAGE_ROLE_TYPE.FUNCTION ||
          message.type === MESSAGE_ROLE_TYPE.AI
        ) {
          handleUpdateMessageCycleList(message)
        }
      })

      sseSource.onreadystatechange = (ev) => {
        handleReadyStateChange(ev.readyState)
      }
      sseSourceRef.current = sseSource
    },
    [
      handleClose,
      handleInitCycleMessage,
      handleReadyStateChange,
      handleUpdateMessageCycleList,
    ],
  )

  const stableValue = useMemo(
    () => ({
      handleSendMessage,
    }),
    [handleSendMessage],
  )
  const unStableValue = useMemo(
    () => ({
      readyState,
      cycleMessageList,
      currentRenderCycle,
    }),
    [currentRenderCycle, cycleMessageList, readyState],
  )
  return (
    <ChatStableWSContext.Provider value={stableValue}>
      <ChatUnStableWSContext.Provider value={unStableValue}>
        {children}
      </ChatUnStableWSContext.Provider>
    </ChatStableWSContext.Provider>
  )
}
