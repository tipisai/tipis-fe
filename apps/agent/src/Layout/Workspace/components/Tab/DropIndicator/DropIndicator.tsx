import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { FC } from "react"
import { dropIndicatorStyle } from "./style"

const DropIndicator: FC<{
  edge: Edge
}> = ({ edge }) => {
  return <div css={dropIndicatorStyle(edge)} />
}

export default DropIndicator
