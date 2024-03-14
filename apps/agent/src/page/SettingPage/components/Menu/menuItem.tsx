import { FC, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { applyLinkStyle, applyMobileLinkStyle } from "./style"

interface MenuItem {
  selected: boolean
  isMobile?: boolean
  path?: string
  label: ReactNode
  onClickMenuItem?: (path?: string) => void
}

export const MenuItem: FC<MenuItem> = (props) => {
  const { isMobile, selected, label, path, onClickMenuItem } = props
  const navigate = useNavigate()

  const applyCurrentLinkStyle = isMobile ? applyMobileLinkStyle : applyLinkStyle

  return (
    <div
      css={applyCurrentLinkStyle(selected)}
      onClick={() => {
        onClickMenuItem?.(path)
        if (!selected && path) {
          navigate({
            pathname: path,
          })
        }
      }}
    >
      {label}
    </div>
  )
}
