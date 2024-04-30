import { Select } from "antd"
import { FC, memo, useCallback } from "react"
import {
  Controller,
  useController,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { SCHEDULE_TYPES } from "@illa-public/public-types"
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

  const { control, getValues } = useFormContext<IAgentForm>()

  const [schedules, triggerIsActive] = useWatch({
    control: control,
    name: ["triggerConfig.schedule", "triggerIsActive"],
  })

  const {
    field: { onChange },
  } = useController({
    control,
    name: "triggerConfig.schedule",
  })

  const getScheduleTypeSetter = useCallback(
    (i: number) => {
      return SCHEDULE_TYPE_MAP_SETTER[schedules[i].scheduleConfig.type]
    },
    [schedules],
  )

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

  const handleUpdateScheduleType = (v: SCHEDULE_TYPES, i: number) => {
    const { schedule } = getValues("triggerConfig")
    const currentSchedule = [...schedule]
    const initOptions = getInitScheduleOptions(v)
    currentSchedule[i] = {
      ...currentSchedule[i],
      scheduleConfig: {
        type: v,
        options: initOptions,
      },
    }

    onChange(currentSchedule)
  }

  if (!Array.isArray(schedules) || schedules.length === 0) {
    return null
  }
  return schedules.map((_, i) => (
    <LayoutBlock
      key={i}
      title={t("editor.ai-agent.label.schedule")}
      customRenderSubtitle={
        <Controller
          control={control}
          name="triggerIsActive"
          render={({ field }) => <BlackSwitch {...field} size="small" />}
        />
      }
    >
      <div css={scheduleContainerStyle(triggerIsActive)}>
        <Controller
          control={control}
          name={`triggerConfig.schedule.${i}.timezone`}
          render={({ field }) => (
            <RowContainer
              labelName={t("flow.editor.trigger.schedule.time_zone")}
              enabled={triggerIsActive}
            >
              <Select
                {...field}
                options={timezoneOptions}
                style={{
                  width: 206,
                }}
                showSearch
                disabled={!triggerIsActive}
              />
            </RowContainer>
          )}
        />

        <Controller
          control={control}
          name={`triggerConfig.schedule.${i}.scheduleConfig.type`}
          render={({ field }) => (
            <RowContainer
              labelName={t("flow.editor.trigger.schedule.schedule_t")}
              enabled={triggerIsActive}
            >
              <Select
                options={SCHEDULE_TYPE_OPTIONS}
                style={{
                  width: 206,
                }}
                value={field.value}
                onChange={(v) => handleUpdateScheduleType(v, i)}
                disabled={!triggerIsActive}
              />
            </RowContainer>
          )}
        />

        <Controller
          control={control}
          name={`triggerConfig.schedule.${i}.scheduleConfig.options`}
          render={({ field }) => {
            const ScheduleTypeSetter = getScheduleTypeSetter(i)
            return (
              <ScheduleTypeSetter
                options={field.value}
                handleUpdateIScheduleOptions={(value) => {
                  field.onChange({
                    ...field.value,
                    ...value,
                  })
                }}
                enabled={triggerIsActive}
              />
            )
          }}
        />
      </div>
    </LayoutBlock>
  ))
})

ScheduleEditor.displayName = "ScheduleEditor"

export default ScheduleEditor
