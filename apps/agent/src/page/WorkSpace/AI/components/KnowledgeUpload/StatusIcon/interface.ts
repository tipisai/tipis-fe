import { FILE_ITEM_DETAIL_STATUS_IN_UI } from "@/utils/drive"

export interface IStatusIconProps {
  status: FILE_ITEM_DETAIL_STATUS_IN_UI
  onClickRetry?: () => void
}
