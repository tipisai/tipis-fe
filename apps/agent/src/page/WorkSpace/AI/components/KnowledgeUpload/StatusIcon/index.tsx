import Icon from "@ant-design/icons"
import { Progress } from "antd"
import { FC } from "react"
import { getColor } from "@illa-public/color-scheme"
import { SuccessIcon } from "@illa-public/icon"
import { ErrorIcon } from "@illa-public/icon"
import { FILE_ITEM_DETAIL_STATUS_IN_UI } from "@/utils/drive"
import { IStatusIconProps } from "./interface"

const AutoplayProgress: FC<Pick<IStatusIconProps, "loaded" | "total">> = ({
  total = 100,
  loaded = 0,
}) => {
  const percent = (loaded / total) * 100
  return (
    <Progress
      type="circle"
      size={16}
      strokeLinecap="square"
      percent={percent > 90 ? 90 : parseFloat(percent.toFixed(2))}
    />
  )
}

const StatusIcon: FC<IStatusIconProps> = ({
  status,
  loaded,
  total,
  onClickRetry,
}) => {
  switch (status) {
    case FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING:
      return <Progress type="circle" size={16} percent={0} />
    case FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING:
      return <AutoplayProgress total={total} loaded={loaded} />
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
