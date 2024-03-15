import { FC } from "react"
import { createPortal } from "react-dom"
import { Rnd } from "react-rnd"
import { useWindowSize } from "react-use"
import { BuilderModal } from "@/components/Modal"
import { MovableModalProps } from "@/components/Modal/interface"

export const MovableModal: FC<MovableModalProps> = (props) => {
  const {
    bodyContent,
    title,
    footerContent,
    onClose,
    defaultPosition,
    docLink,
  } = props
  const { width, height } = useWindowSize()

  return createPortal(
    <Rnd
      default={
        defaultPosition ?? {
          x: width / 2 - 200,
          y: height - 300 - 263,
          width: 400,
          height: 263,
        }
      }
      style={{
        zIndex: 1000,
        pointerEvents: "auto",
        opacity: 1,
      }}
      minWidth={400}
      minHeight={263}
      bounds="window"
    >
      <BuilderModal
        title={title}
        bodyContent={bodyContent}
        onClose={onClose}
        footerContent={footerContent}
        canMove
        docLink={docLink}
      />
    </Rnd>,
    document.body,
  )
}

MovableModal.displayName = "MovableModal"
