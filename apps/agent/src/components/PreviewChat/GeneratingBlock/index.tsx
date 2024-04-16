import { AnimatePresence, motion } from "framer-motion"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import StopIcon from "@/assets/agent/stop.svg?react"
import { IGeneratingBlockProps } from "./interface"
import {
  generatingContainerStyle,
  generatingContentContainerStyle,
  generatingDividerStyle,
  generatingTextStyle,
  stopIconStyle,
} from "./style"

const GeneratingBlock = memo((props: IGeneratingBlockProps) => {
  const { isReceiving, handleClickStop } = props

  const { t } = useTranslation()
  return (
    <AnimatePresence>
      {isReceiving && (
        <motion.div
          css={generatingContainerStyle}
          initial={{
            y: 0,
            opacity: 0,
          }}
          animate={{
            y: -16,
            opacity: 1,
          }}
          exit={{
            y: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div css={generatingContentContainerStyle}>
            <div css={generatingTextStyle}>
              {t("editor.ai-agent.button.generating")}
            </div>
            <div css={generatingDividerStyle} />
            <StopIcon css={stopIconStyle} onClick={handleClickStop} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

GeneratingBlock.displayName = "GeneratingBlock"

export default GeneratingBlock
