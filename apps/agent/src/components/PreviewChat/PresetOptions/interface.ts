import { PRESET_OPTION_ID } from "./constants"

export interface IPresetCardProps {
  title: string
  description: string
  id: PRESET_OPTION_ID
  onClickCard: (cardID: PRESET_OPTION_ID) => void
}

export interface IPresetOptionsProps {
  onClickCard: (cardID: PRESET_OPTION_ID) => void
}
