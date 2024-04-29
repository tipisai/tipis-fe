import { FC } from "react"
import { useTranslation } from "react-i18next"
import { ResourceCard } from "./components/ResourceCard"
import { SuggestResourceCard } from "./components/ResourceCard/suggestCard"
import { useGetIntegrationTypeList } from "./config"
import { IIntegrationTypeSelectorProps } from "./interface"
import { categoryStyle, containerStyle, resourceListStyle } from "./style"

export const IntegrationTypeSelector: FC<IIntegrationTypeSelectorProps> = (
  props,
) => {
  const { onSelect, filterIntegrationType } = props

  const { t } = useTranslation()

  const integrationTypeList = useGetIntegrationTypeList()

  const finalResourceTypeList = integrationTypeList.filter((resource) => {
    const { item } = resource

    const finalItems = item
      .filter(({ hidden }) => !hidden)
      .filter(({ resourceType }) => {
        if (filterIntegrationType) {
          return filterIntegrationType(resourceType)
        }
        return resourceType
      })
    return finalItems.length > 0
  })

  return (
    <div css={containerStyle}>
      {finalResourceTypeList.map(({ title, item, category }) => {
        return (
          <div key={category}>
            <span css={categoryStyle}>{title}</span>
            <div css={resourceListStyle}>
              {item
                .filter(({ hidden }) => !hidden)
                .filter(({ resourceType }) => {
                  if (filterIntegrationType) {
                    return filterIntegrationType(resourceType)
                  }
                  return resourceType
                })
                .map(({ resourceType }) => (
                  <ResourceCard
                    key={resourceType}
                    onSelect={(item) => {
                      onSelect(item)
                    }}
                    resourceType={resourceType}
                  />
                ))}
            </div>
          </div>
        )
      })}
      <div>
        <span css={categoryStyle}>
          {t("editor.action.form.title.feedback")}
        </span>
        <div css={resourceListStyle}>
          <SuggestResourceCard />
        </div>
      </div>
    </div>
  )
}

IntegrationTypeSelector.displayName = "ResourceTypeSelector"
