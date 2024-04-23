import { FC } from "react"
import { RESOURCE_TYPE_MAP_ICON } from "@illa-public/icon"
import { useGetResourceNameFormResourceType } from "@illa-public/utils"
import { ResourceCardSelectorProps } from "./interface"
import { applyItemStyle, nameStyle, titleContainerStyle } from "./style"

export const ResourceCard: FC<ResourceCardSelectorProps> = (props) => {
  const { resourceType, onSelect } = props

  const getResourceNameFromResourceType = useGetResourceNameFormResourceType()

  const onClickCard = () => {
    onSelect(resourceType)
  }
  const ResourceIcon = RESOURCE_TYPE_MAP_ICON[resourceType]

  return (
    <div css={applyItemStyle} onClick={onClickCard}>
      {ResourceIcon ? <ResourceIcon /> : null}
      <div css={titleContainerStyle}>
        <div css={nameStyle}>
          {getResourceNameFromResourceType(resourceType)}
        </div>
      </div>
    </div>
  )
}

ResourceCard.displayName = "ResourceCard"
