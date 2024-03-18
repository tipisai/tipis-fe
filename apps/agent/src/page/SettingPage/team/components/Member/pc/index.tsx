import { FC } from "react"
import { Header } from "./components/Header"
import { PCMemberList } from "./components/List"
import {
  cardAndMemberListContainerStyle,
  memberListWrapperStyle,
} from "./style"

export const PCMemberPage: FC = () => {
  return (
    <div css={memberListWrapperStyle}>
      <Header />
      <div css={cardAndMemberListContainerStyle}>
        <PCMemberList />
      </div>
    </div>
  )
}

export default PCMemberPage
