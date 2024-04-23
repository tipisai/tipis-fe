import { Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import RowLayoutContainer from "@/Layout/AIFunction/FormLayoutContainer/rowLayoutContainer"

const ActionTypeSelect: FC = () => {
  const { t } = useTranslation()

  const methods = useFormContext()

  return (
    <Controller
      name="content.method"
      control={methods.control}
      rules={{
        required: t("editor.ai-agent.validation_blank.name"),
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <RowLayoutContainer
          labelName={t("editor.action.resource.restapi.label.action_type")}
        >
          <Select
            {...field}
            style={{ width: "100%" }}
            maxLength={60}
            options={[
              {
                label: "GET",
                value: "GET",
              },
              {
                label: "POST",
                value: "POST",
              },
              {
                label: "PUT",
                value: "PUT",
              },
              {
                label: "DELETE",
                value: "DELETE",
              },
              {
                label: "PATCH",
                value: "PATCH",
              },
              {
                label: "HEAD",
                value: "HEAD",
              },
              {
                label: "OPTIONS",
                value: "OPTIONS",
              },
            ]}
          />
        </RowLayoutContainer>
      )}
    />
  )
}

export default ActionTypeSelect
