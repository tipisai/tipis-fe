import { motion } from "framer-motion"
import { FC } from "react"
import { useGetPresetOptions } from "../hook"
import { IPresetOptionsProps } from "../interface"
import PresetCard from "./PresetCard"
import {
  presetOptionsContainerStyle,
  presetOptionsPositionContainerStyle,
} from "./style"

const PresetOptions: FC<IPresetOptionsProps> = (props) => {
  const { onClickCard } = props
  const options = useGetPresetOptions()
  return (
    <motion.div
      css={presetOptionsPositionContainerStyle}
      animate={{
        y: "calc(-100% - 16px)",
      }}
    >
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
    </motion.div>
  )
}

export default PresetOptions
