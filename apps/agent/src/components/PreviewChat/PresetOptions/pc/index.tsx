import { FC } from "react"
import { useGetPresetOptions } from "../hook"
import { IPresetOptionsProps } from "../interface"
import PresetCard from "./PresetCard"
import { presetOptionsContainerStyle } from "./style"

const PresetOptions: FC<IPresetOptionsProps> = (props) => {
  const { onClickCard } = props
  const options = useGetPresetOptions()
  return (
    <div css={presetOptionsContainerStyle}>
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
  )
}

export default PresetOptions
