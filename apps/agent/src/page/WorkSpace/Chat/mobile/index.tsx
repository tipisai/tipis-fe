import { FC } from "react"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout/fistPageLayout"
import HeaderTools from "../components/HeaderTools"
import DefaultChat from "../module/chatHistory"

const MobileChatPage: FC = () => {
  return (
    <>
      <MobileFirstPageLayout headerExtra={<HeaderTools />} title="Chat">
        <DefaultChat isMobile />
      </MobileFirstPageLayout>
    </>
  )
}

export default MobileChatPage
