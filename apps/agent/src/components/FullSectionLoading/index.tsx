import { LoadingIcon } from "@illa-public/icon"
import { Spin } from "antd"
import { FC, memo } from "react"
import { fullSectionStyle, rotateAnimation } from "./style"

const FullSectionLoading: FC = memo(() => {
  return (
    <div css={fullSectionStyle}>
      <Spin indicator={<LoadingIcon css={rotateAnimation} />} spinning />
    </div>
  )
})

FullSectionLoading.displayName = "FullSectionLoading"

export default FullSectionLoading
