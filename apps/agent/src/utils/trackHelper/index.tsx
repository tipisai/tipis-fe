import { TIPISProperties, TipisTrack } from "@illa-public/track-utils"

export const track = (
  event: string,
  properties: Omit<TIPISProperties, "page"> = {},
) => {
  TipisTrack.track(event, {
    ...properties,
  })
}

export const useTrack = () => {
  return track
}
