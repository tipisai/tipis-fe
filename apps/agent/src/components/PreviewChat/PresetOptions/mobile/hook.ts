import { stagger, useAnimate } from "framer-motion"
import { useEffect } from "react"

const staggerMenuItems = stagger(0.1, { startDelay: 0.2 })

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
