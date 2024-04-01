import { Progress } from "antd"
import { FC } from "react"
import { getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE } from "@illa-public/public-types"
import { FILE_ITEM_DETAIL_STATUS_IN_UI, IFileDetailInfo } from "@/utils/drive"
import { fileTypeIconStyle } from "./style"

const AutoplayProgress: FC<Pick<IFileDetailInfo, "loaded" | "total">> = ({
  loaded,
  total,
}) => {
  const percent = (loaded / total) * 100
  return (
    <Progress
      type="circle"
      size={16}
      percent={percent > 90 ? 90 : parseFloat(percent.toFixed(2))}
      style={{
        marginRight: "4px",
      }}
    />
  )
}

const StatusIcon: FC<
  Partial<Pick<IFileDetailInfo, "status" | "contentType" | "loaded" | "total">>
> = ({ status, contentType, loaded = 0, total = 100 }) => {
  switch (status) {
    case FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING:
      return (
        <Progress
          type="circle"
          size={16}
          percent={0}
          style={{
            marginRight: "4px",
          }}
        />
      )
    case FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING:
      return <AutoplayProgress total={total} loaded={loaded} />

    default:
    case FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR:
    case FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS:
      return getFileIconByContentType(
        GCS_OBJECT_TYPE.FILE,
        contentType,
        fileTypeIconStyle,
      )
  }
}

export default StatusIcon
