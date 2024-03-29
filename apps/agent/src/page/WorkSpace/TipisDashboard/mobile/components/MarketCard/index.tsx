import Icon from "@ant-design/icons"
import { List } from "antd"
import { FC } from "react"
import { ForkIcon, PlayOutlineIcon, StarOutlineIcon } from "@illa-public/icon"
import { getLLM } from "@illa-public/market-agent"
import { formatNumForAgent } from "@illa-public/utils"
import { useNavigateToMarketTipiDetail } from "@/utils/routeHelper/hook"
import TagList from "../TagList"
import { MarketAgentCardProps } from "./interface"
import {
  actionContainerStyle,
  actionCountStyle,
  actionStyle,
  agentIconStyle,
  cardContentContainerStyle,
  cardStyle,
  descriptionStyle,
  headerStyle,
  iconStyle,
  modalInfoStyle,
  modelLogoStyle,
  modelNameStyle,
  nameStyle,
} from "./style"

const MarketCard: FC<MarketAgentCardProps> = (props) => {
  const { marketAIAgent } = props
  const { aiAgent, marketplace } = marketAIAgent ?? {}

  const navigateToMarketTipiDetail = useNavigateToMarketTipiDetail()

  const onClickCard = () => {
    navigateToMarketTipiDetail({
      tipisID: aiAgent?.aiAgentID,
      title: aiAgent?.name,
      tabIcon: aiAgent?.icon,
    })
  }

  return (
    <List.Item onClick={onClickCard}>
      <div css={cardStyle}>
        <div css={headerStyle}>
          <img css={agentIconStyle} src={aiAgent.icon} alt={aiAgent.name} />
          <div css={actionContainerStyle}>
            <div css={actionStyle}>
              <div css={actionCountStyle}>
                <Icon component={ForkIcon} css={iconStyle} />
                {formatNumForAgent(marketplace?.numForks)}
              </div>
              <div css={actionCountStyle}>
                <Icon component={StarOutlineIcon} css={iconStyle} />
                {formatNumForAgent(marketplace?.numStars)}
              </div>
              <div css={actionCountStyle}>
                <Icon component={PlayOutlineIcon} css={iconStyle} />
                {formatNumForAgent(marketplace?.numRuns)}
              </div>
            </div>
          </div>
        </div>
        <div css={cardContentContainerStyle}>
          <span css={nameStyle}>{aiAgent?.name}</span>
          <div css={modalInfoStyle}>
            <div css={modelLogoStyle}>{getLLM(aiAgent?.model)?.logo}</div>
            <div css={modelNameStyle}>{getLLM(aiAgent?.model)?.name}</div>
          </div>
          <div css={descriptionStyle}>{aiAgent?.description}</div>
          {!!(marketplace?.hashtags && marketplace?.hashtags.length) && (
            <TagList
              tagList={marketplace?.hashtags}
              limitTagNum={2}
              isCardTag
            />
          )}
        </div>
      </div>
    </List.Item>
  )
}
export default MarketCard
