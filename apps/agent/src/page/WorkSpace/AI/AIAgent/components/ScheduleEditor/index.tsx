import { Select } from "antd"
import { FC, memo, useCallback, useEffect, useRef } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { SCHEDULE_TYPES } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import BlackSwitch from "@/components/BlackSwitch"
import { IAgentForm } from "../../interface"
import RowContainer from "./components/RowContainer"
import { SCHEDULE_TYPE_OPTIONS, timezoneOptions } from "./constants"
import { SCHEDULE_TYPE_MAP_SETTER } from "./module/ScheduleRule"
import { scheduleContainerStyle, scheduleInputsContainerStyle } from "./style"
import { getInitScheduleOptions } from "./utils"

const ScheduleEditor: FC = memo(() => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const { control } = useFormContext<IAgentForm>()

  const [schedules, triggerIsActive] = useWatch({
    control: control,
    name: ["triggerConfig.schedule", "triggerIsActive"],
  })

  const getScheduleTypeSetter = useCallback((type: SCHEDULE_TYPES) => {
    return SCHEDULE_TYPE_MAP_SETTER[type]
  }, [])

  const getUpdateScheduleConfig = (v: SCHEDULE_TYPES) => {
    const initOptions = getInitScheduleOptions(v)
    return {
      type: v,
      options: initOptions,
    }
  }

  useEffect(() => {
    if (triggerIsActive && containerRef.current) {
      containerRef.current.scrollIntoView({
        block: "end",
      })
    }
  }, [triggerIsActive])

  if (!Array.isArray(schedules) || schedules.length === 0) {
    return null
  }
  return (
    <LayoutBlock
      title={t("editor.ai-agent.label.schedule")}
      customRenderSubtitle={
        <Controller
          control={control}
          name="triggerIsActive"
          render={({ field }) => <BlackSwitch {...field} size="small" />}
        />
      }
    >
      <div ref={containerRef} css={scheduleInputsContainerStyle}>
        {triggerIsActive &&
          schedules.map((_, i) => (
            <div css={scheduleContainerStyle(triggerIsActive)} key={i}>
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
                name={`triggerConfig.schedule.${i}.scheduleConfig`}
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
                      value={field.value.type}
                      onChange={(v) => {
                        const scheduleConfig = getUpdateScheduleConfig(v)
                        field.onChange(scheduleConfig)
                      }}
                      disabled={!triggerIsActive}
                    />
                  </RowContainer>
                )}
              />

              <Controller
                control={control}
                name={`triggerConfig.schedule.${i}.scheduleConfig`}
                render={({ field }) => {
                  const ScheduleTypeSetter = getScheduleTypeSetter(
                    field.value.type,
                  )
                  return (
                    <ScheduleTypeSetter
                      options={field.value.options}
                      handleUpdateIScheduleOptions={(value) => {
                        field.onChange({
                          type: field.value.type,
                          options: {
                            ...field.value.options,
                            ...value,
                          },
                        })
                      }}
                      enabled={triggerIsActive}
                    />
                  )
                }}
              />
            </div>
          ))}
      </div>
    </LayoutBlock>
  )
})

ScheduleEditor.displayName = "ScheduleEditor"

export default ScheduleEditor
