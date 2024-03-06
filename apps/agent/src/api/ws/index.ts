import { Broadcast } from "./interface"
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
