import { stagger, useAnimate } from "framer-motion"
import { useEffect } from "react"

const staggerMenuItems = stagger(0.15, { startDelay: 0.1, ease: "easeInOut" })

export function useMenuAnimation() {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(
      ".presetCard",
      { y: [100, 0] },
      {
        duration: 0.2,
        delay: staggerMenuItems,
      },
    )
  }, [animate])

  return scope
}
