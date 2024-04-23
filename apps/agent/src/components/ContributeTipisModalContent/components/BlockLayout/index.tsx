import { memo } from "react"
import { IBlockLayoutProps } from "./interface"
import { blockLayoutStyle } from "./style"

const BlockLayout = memo((props: IBlockLayoutProps) => {
  return <div css={blockLayoutStyle}>{props.children}</div>
})

BlockLayout.displayName = "BlockLayout"

export default BlockLayout
