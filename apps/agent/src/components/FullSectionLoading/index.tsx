import { FC, memo } from "react"
import { Loading } from "@illa-design/react"
import { fullSectionStyle } from "./style"

const FullSectionLoading: FC = memo(() => {
  return (
    <div css={fullSectionStyle}>
      <Loading colorScheme="techPurple" />
    </div>
  )
})

FullSectionLoading.displayName = "FullSectionLoading"

export default FullSectionLoading
