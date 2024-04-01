import { FILE_ITEM_DETAIL_STATUS_IN_UI } from "@/utils/drive"

export interface IStatusIconProps {
  total: number
  loaded: number
  status: FILE_ITEM_DETAIL_STATUS_IN_UI
  onClickRetry?: () => void
}
