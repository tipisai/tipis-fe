import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { MoreIcon } from "@illa-public/icon"

const MobileMoreActionButton: FC = () => {
  return <Button icon={<Icon component={MoreIcon} />} type="text" />
}

MobileMoreActionButton.displayName = "MobileMoreActionButton"
export default MobileMoreActionButton
