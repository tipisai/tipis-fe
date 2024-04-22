import { PRODUCT_SORT_BY } from "./constants"

export interface ProductListParams {
  page: number
  sortedBy: PRODUCT_SORT_BY
  search?: string
  hashtags?: string
}
