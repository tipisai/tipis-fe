import { Select } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { SCHEDULE_TYPES } from "@illa-public/public-types"
import RowContainer from "../../components/RowContainer"
import IntervalSetter from "../IntervalSetter"
import { MINUTE_OPTIONS } from "./config"
import { IScheduleRuleProps } from "./interface"

const HourScheduleSetter: FC<IScheduleRuleProps> = (props) => {
  const { options, handleUpdateIScheduleOptions, enabled } = props
  const { t } = useTranslation()

  return (
    <>
      <RowContainer
        labelName={t("flow.editor.trigger.schedule.at")}
        enabled={enabled}
      >
        <Select
          value={options.minute}
          style={{
            width: 206,
          }}
          options={MINUTE_OPTIONS}
          onChange={(v) => {
            handleUpdateIScheduleOptions({
              minute: v,
            })
          }}
          disabled={!enabled}
        />
      </RowContainer>
      <RowContainer
        labelName={t("flow.editor.trigger.schedule.interval")}
        enabled={enabled}
      >
        <IntervalSetter
          scheduleType={SCHEDULE_TYPES.EVERY_HOUR}
          interval={options.interval}
          handleUpdateIScheduleOptions={handleUpdateIScheduleOptions}
          enabled={enabled}
        />
      </RowContainer>
    </>
  )
}

export default HourScheduleSetter
