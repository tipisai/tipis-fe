import {
  TIPISProperties,
  TIPIS_TRACK_EVENT_TYPE,
  TipisTrack,
} from "@illa-public/track-utils"

export const track = (
  event: TIPIS_TRACK_EVENT_TYPE,
  properties: Omit<TIPISProperties, "page"> = {},
) => {
  TipisTrack.track(event, {
    ...properties,
  })
}

export const useTrack = () => {
  return track
}
