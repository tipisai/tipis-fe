import { SEND_MESSAGE_WS_TYPE } from "@/components/PreviewChat/TipisWebscoketContext/interface"
import { Broadcast, FILE_SOURCE } from "./interface"
import { TextSignal, TextTarget } from "./textSignal"

export function getTextMessagePayload<T>(
  signal: TextSignal,
  target: TextTarget,
  broadcast: boolean,
  reduxBroadcast: Broadcast | null,
  teamID: string,
  uid: string,
  payload: T[],
): string {
  return JSON.stringify({
    signal,
    target,
    option: broadcast ? 1 : 0,
    broadcast: reduxBroadcast,
    payload,
    teamID,
    uid,
  })
}

export function getWithFileMessagePayload(
  fileIDs: string[],
  fileSource: FILE_SOURCE,
): string {
  return JSON.stringify({
    signal: TextSignal.SIGNAL_ADD_CHAT_FILE,
    target: TextTarget.ACTION,
    option: 0,
    broadcast: {
      type: SEND_MESSAGE_WS_TYPE.ADD_FILE,
      payload: {},
    },
    payload: [
      {
        fileIDs,
        fileSource,
      },
    ],
    teamID: "",
    uid: "",
  })
}
