import { FC } from "react"
import UserInfoContent from "../../components/UserInfoContent"
import { menuFooterContainerStyle } from "./style"

const MenuFooter: FC = () => {
  return (
    <div css={menuFooterContainerStyle}>
      <UserInfoContent />
    </div>
  )
}

export default MenuFooter
