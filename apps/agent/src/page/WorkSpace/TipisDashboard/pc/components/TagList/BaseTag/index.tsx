import Icon from "@ant-design/icons"
import { Tag } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { CloseIcon } from "@illa-public/icon"
import { closeIconStyle, tagContentStyle } from "./style"

interface BaseTagProps {
  name: string
  isActive?: boolean
  closable?: boolean
  handleClose?: () => void
  handleClick?: (name: string) => void
}

export const BaseTag: FC<BaseTagProps> = (props) => {
  const { name, isActive, closable, handleClose, handleClick } = props
  const { t } = useTranslation()
  return (
    <Tag
      onClick={() => handleClick?.(name)}
      style={{
        padding: "1px 8px",
        margin: 0,
        borderRadius: "12px",
        backgroundColor: isActive ? "#fff" : getColor("grayBlue", "09"),
        color: isActive
          ? getColor("techPurple", "03")
          : getColor("grayBlue", "02"),
        border: `1px solid ${
          isActive ? getColor("techPurple", "03") : getColor("grayBlue", "09")
        }`,
        cursor: "pointer",
      }}
    >
      <span css={tagContentStyle}>
        <span>{t(name)}</span>
        {closable && (
          <span css={closeIconStyle} onClick={handleClose}>
            <Icon component={CloseIcon} />
          </span>
        )}
      </span>
    </Tag>
  )
}
