import { Select } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IScheduleOptions, SCHEDULE_TYPES } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import BlackSwitch from "@/components/BlackSwitch"
import { IAgentForm } from "../../interface"
import RowContainer from "./components/RowContainer"
import { timezoneOptions } from "./constants"
import { SCHEDULE_TYPE_MAP_SETTER } from "./module/ScheduleRule"
import { scheduleContainerStyle } from "./style"
import { getInitScheduleOptions } from "./utils"

const ScheduleEditor: FC = memo(() => {
  const { t } = useTranslation()

  const { control, setValue, getValues } = useFormContext<IAgentForm>()

  const [schedule] = useWatch({
    control: control,
    name: ["schedule"],
  })

  const ScheduleTypeSetter = SCHEDULE_TYPE_MAP_SETTER[schedule.type]

  const SCHEDULE_TYPE_OPTIONS = [
    {
      label: t("flow.editor.trigger.schedule.every_hour"),
      value: SCHEDULE_TYPES.EVERY_HOUR,
    },
    {
      label: t("flow.editor.trigger.schedule.every_day"),
      value: SCHEDULE_TYPES.EVERY_DAY,
    },
    {
      label: t("flow.editor.trigger.schedule.every_week"),
      value: SCHEDULE_TYPES.EVERY_WEEK,
    },
    {
      label: t("flow.editor.trigger.schedule.every_mont"),
      value: SCHEDULE_TYPES.EVERY_MONTH,
    },
    {
      label: t("flow.editor.trigger.schedule.every_year"),
      value: SCHEDULE_TYPES.EVERY_YEAR,
    },
  ]

  const handleUpdateTimezone = (v: string) => {
    const schedule = getValues("schedule")
    setValue("schedule", {
      ...schedule,
      timezone: v,
    })
  }
  const handleUpdateScheduleType = (v: SCHEDULE_TYPES) => {
    const schedule = getValues("schedule")
    const initOptions = getInitScheduleOptions(v)
    setValue("schedule", {
      ...schedule,
      type: v,
      options: initOptions,
    })
  }
  const handleUpdateIScheduleOptions = (v: IScheduleOptions) => {
    const schedule = getValues("schedule")
    setValue("schedule", {
      ...schedule,
      options: {
        ...schedule.options,
        ...v,
      },
    })
  }
  const handleUpdateEnabled = (v: boolean) => {
    const schedule = getValues("schedule")
    setValue("schedule", {
      ...schedule,
      enabled: v,
    })
  }

  return (
    <Controller
      name="schedule"
      control={control}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          title={t("editor.ai-agent.label.schedule")}
          customRenderSubtitle={
            <BlackSwitch
              value={field.value.enabled}
              onChange={handleUpdateEnabled}
              size="small"
            />
          }
        >
          <div css={scheduleContainerStyle(field.value.enabled)}>
            <RowContainer
              labelName={t("flow.editor.trigger.schedule.time_zone")}
              enabled={field.value.enabled}
            >
              <Select
                options={timezoneOptions}
                style={{
                  width: 206,
                }}
                value={field.value.timezone}
                showSearch
                onChange={handleUpdateTimezone}
                disabled={!field.value.enabled}
              />
            </RowContainer>
            <RowContainer
              labelName={t("flow.editor.trigger.schedule.schedule_t")}
              enabled={field.value.enabled}
            >
              <Select
                options={SCHEDULE_TYPE_OPTIONS}
                style={{
                  width: 206,
                }}
                value={field.value.type}
                onChange={handleUpdateScheduleType}
                disabled={!field.value.enabled}
              />
            </RowContainer>
            <ScheduleTypeSetter
              options={field.value.options}
              handleUpdateIScheduleOptions={handleUpdateIScheduleOptions}
              enabled={field.value.enabled}
            />
          </div>
        </LayoutBlock>
      )}
    />
  )
})

ScheduleEditor.displayName = "ScheduleEditor"

export default ScheduleEditor
