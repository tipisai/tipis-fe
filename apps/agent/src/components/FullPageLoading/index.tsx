import { LoadingIcon } from "@illa-public/icon"
import { Spin } from "antd"
import { FC } from "react"
import {
  fullPageLoadingWrapperStyle,
  maskStyle,
  rotateAnimation,
} from "./style"

export const FullPageLoading: FC<{ hasMask?: boolean }> = (props) => {
  return (
    <div css={fullPageLoadingWrapperStyle}>
      {props.hasMask && <div css={maskStyle} />}
      <Spin indicator={<LoadingIcon css={rotateAnimation} />} spinning />
    </div>
  )
}

FullPageLoading.displayName = "FullPageLoading"
