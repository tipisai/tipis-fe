import { FC } from "react"
import { INTEGRATION_TYPE_MAP_ICON } from "@illa-public/icon"
import { IIntegrationListItemProps } from "./interface"
import {
  iconStyle,
  itemContainerStyle,
  itemIconAndNameContainerStyle,
  itemNameStyle,
  itemTimeContainerStyle,
} from "./style"

const IntegrationListItem: FC<IIntegrationListItemProps> = (props) => {
  const {
    integrationType,
    integrationName,
    integrationID,
    onClickItem,
    isSelected,
  } = props
  const ResourceIcon = INTEGRATION_TYPE_MAP_ICON[integrationType]

  const onClickCard = () => {
    onClickItem(integrationID)
  }

  return (
    <div css={itemContainerStyle(isSelected)} onClick={onClickCard}>
      <div css={itemIconAndNameContainerStyle}>
        {ResourceIcon ? (
          <ResourceIcon css={iconStyle} />
        ) : (
          <div css={iconStyle} />
        )}
        <p css={itemNameStyle}>{integrationName}</p>
      </div>
      <div css={itemTimeContainerStyle}></div>
    </div>
  )
}

export default IntegrationListItem
