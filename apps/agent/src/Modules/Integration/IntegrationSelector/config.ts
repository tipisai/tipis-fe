import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { TIntegrationType } from "@illa-public/public-types"

export interface ResourceItem {
  resourceType: TIntegrationType
  hidden?: boolean
}

export const Apis: ResourceItem[] = [
  {
    resourceType: "tencentcos",
  },
  {
    resourceType: "larkbot",
  },
]

export const useGetIntegrationTypeList = () => {
  const { t } = useTranslation()

  const integrationTypeList = useMemo(
    () => [
      {
        title: t("editor.action.type.api"),
        item: Apis,
        category: "apis" as const,
      },
    ],
    [t],
  )

  return integrationTypeList
}
