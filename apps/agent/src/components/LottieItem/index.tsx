import lottie, { AnimationItem } from "lottie-web"
import { FC, useCallback, useEffect, useRef } from "react"
import { ILottieItemProps } from "./interface"
import { lottieItemStyle } from "./style"

const LottieItem: FC<ILottieItemProps> = ({
  configJson,
  autoplay,
  loop,
  size,
}) => {
  const lottieContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)
  const loadAnimation = useCallback(() => {
    if (!lottieContainerRef.current) return
    animationRef.current = lottie.loadAnimation({
      container: lottieContainerRef.current,
      animationData: configJson,
      renderer: "svg",
      loop,
      autoplay,
    })
  }, [autoplay, configJson, loop])

  useEffect(() => {
    loadAnimation()
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
        animationRef.current = null
      }
    }
  }, [loadAnimation])
  return <div ref={lottieContainerRef} css={lottieItemStyle(size)} />
}

export default LottieItem
