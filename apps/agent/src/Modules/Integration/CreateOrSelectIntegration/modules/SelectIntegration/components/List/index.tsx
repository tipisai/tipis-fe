import { FC } from "react"
import { IIntegrationListProps } from "./interface"
import IntegrationListItem from "./item"

const IntegrationList: FC<IIntegrationListProps> = (props) => {
  const { onClickItem, selectedIntegrationID } = props
  return (
    <div>
      <IntegrationListItem
        integrationType={"tencentcos"}
        integrationName={"1111"}
        integrationID={"11111"}
        onClickItem={onClickItem}
        isSelected={selectedIntegrationID === "11111"}
      />
    </div>
  )
}

export default IntegrationList
