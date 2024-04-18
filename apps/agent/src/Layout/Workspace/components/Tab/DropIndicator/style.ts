import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { css } from "@emotion/react"

export const getDriStyle = (edge: Edge) => {
  switch (edge) {
    case "top":
      return css`
        top: -5px;
      `
    case "bottom":
      return css`
        bottom: -5px;
      `
  }
}

export const dropIndicatorStyle = (edge: Edge) => css`
  display: block;
  position: absolute;
  z-index: 1;
  pointer-events: none;
  height: 2px;
  left: 4px;
  right: 0px;
  ${getDriStyle(edge)};
  background: rgba(101, 74, 236, 0.5);
`
