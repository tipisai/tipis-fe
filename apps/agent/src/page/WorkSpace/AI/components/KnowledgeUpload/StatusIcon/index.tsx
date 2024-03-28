import Icon from "@ant-design/icons"
import { Progress } from "antd"
import { FC } from "react"
import { useRaf } from "react-use"
import { getColor } from "@illa-public/color-scheme"
import { SuccessIcon } from "@illa-public/icon"
import { ErrorIcon } from "@illa-public/icon"
import { FILE_ITEM_DETAIL_STATUS_IN_UI } from "@/utils/drive"
import { IStatusIconProps } from "./interface"

const AutoplayProgress = () => {
  const loadedNum = useRaf(3000, 0)
  return (
    <Progress
      type="circle"
      size={16}
      strokeLinecap="square"
      percent={parseFloat((loadedNum * 85).toFixed(2))}
    />
  )
}

const StatusIcon: FC<IStatusIconProps> = ({ status, onClickRetry }) => {
  switch (status) {
    case FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING:
      return <Progress type="circle" size={16} percent={0} />
    case FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING:
      return <AutoplayProgress />
    case FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS:
      return (
        <SuccessIcon
          style={{
            color: getColor("green", "03"),
          }}
        />
      )
    case FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR:
      return (
        <Icon
          component={ErrorIcon}
          onClick={onClickRetry}
          style={{
            color: getColor("red", "03"),
          }}
        />
      )
    default:
      return null
  }
}

export default StatusIcon
