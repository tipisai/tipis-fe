import { memo } from "react"
import { useGetPresetOptions } from "../hook"
import { IPresetOptionsProps } from "../interface"
import PresetCard from "./PresetCard"
import { useMenuAnimation } from "./hook"
import {
  presetOptionsContainerStyle,
  presetOptionsPositionContainerStyle,
} from "./style"

const PresetOptions = memo((props: IPresetOptionsProps) => {
  const { onClickCard } = props
  const options = useGetPresetOptions()

  const scope = useMenuAnimation()
  return (
    <div css={presetOptionsPositionContainerStyle}>
      <div css={presetOptionsContainerStyle} ref={scope}>
        {options.map((option) => (
          <PresetCard
            key={option.id}
            id={option.id}
            title={option.title}
            description={option.description}
            onClickCard={onClickCard}
          />
        ))}
      </div>
    </div>
  )
})

PresetOptions.displayName = "MobilePresetOptions"

export default PresetOptions
