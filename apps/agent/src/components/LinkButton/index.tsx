import { Button, ConfigProvider } from "antd"
import { AnchorHTMLAttributes, CSSProperties, FC, ReactNode } from "react"

interface LinkButtonProps {
  children?: string | ReactNode
  style?: CSSProperties
  onClick?: () => void
  href?: string
  fontSize?: number
  target?: AnchorHTMLAttributes<HTMLElement>["target"]
}

const LinkButton: FC<LinkButtonProps> = ({
  children,
  style,
  onClick,
  href,
  fontSize = 12,
  target = "_self",
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            fontSize,
            paddingBlock: 0,
            paddingInline: 0,
          },
        },
      }}
    >
      <Button
        style={style}
        href={href}
        type="link"
        onClick={onClick}
        target={target}
      >
        {children}
      </Button>
    </ConfigProvider>
  )
}

export default LinkButton
