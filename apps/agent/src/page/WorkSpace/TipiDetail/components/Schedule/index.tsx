import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { TimeIcon } from "@illa-public/icon"
import { IScheduleProps } from "./interface"
import {
  labelStyle,
  scheduleContainerStyle,
  scheduleItemContainerStyle,
  scheduleItemStyle,
  scheduleTextStyle,
  timeIconStyle,
} from "./style"
import { getOptionDetail } from "./utils"

const Schedule: FC<IScheduleProps> = ({ schedule }) => {
  const { t } = useTranslation()
  return (
    <div css={scheduleContainerStyle}>
      <p css={labelStyle}>{t("editor.ai-agent.label.schedule")}</p>
      <div css={scheduleItemContainerStyle}>
        {schedule.map((item, i) => (
          <div key={i} css={scheduleItemStyle}>
            <Icon component={TimeIcon} css={timeIconStyle} />
            <span css={scheduleTextStyle}>
              {getOptionDetail(
                item.scheduleConfig.type,
                item.scheduleConfig.options,
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Schedule
