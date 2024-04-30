import { Input, Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ITencentCosIntegration } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { regionOptions } from "./constants"

const TencentCosConfigElement: FC = () => {
  const { control } = useFormContext<ITencentCosIntegration>()
  const { t } = useTranslation()
  return (
    <>
      <Controller
        name="content.bucketName"
        control={control}
        rules={{
          required: t("editor.action.form.tips.tx.bucket_name"),
        }}
        render={({ field }) => {
          return (
            <LabelWithController
              title={t("editor.action.form.label.tx.bucket_name")}
              required
            >
              <Input
                size="large"
                {...field}
                placeholder="examplebucket-1250000000"
              />
            </LabelWithController>
          )
        }}
      />
      <Controller
        name="content.region"
        control={control}
        render={({ field }) => {
          return (
            <LabelWithController
              title={t("editor.action.form.label.tx.region")}
            >
              <Select
                options={regionOptions}
                style={{
                  width: "100%",
                }}
                placeholder={regionOptions[0].value}
                showSearch
                size="large"
                {...field}
              />
            </LabelWithController>
          )
        }}
      />
      <Controller
        name="content.accessKeyID"
        control={control}
        rules={{
          required: t("editor.action.form.tips.tx.secret_id"),
        }}
        render={({ field }) => {
          return (
            <LabelWithController
              title={t("editor.action.form.label.tx.secret_id")}
              required
            >
              <Input size="large" {...field} />
            </LabelWithController>
          )
        }}
      />
      <Controller
        name="content.secretAccessKey"
        control={control}
        rules={{
          required: t("editor.action.form.tips.tx.secret_key"),
        }}
        render={({ field }) => {
          return (
            <LabelWithController
              title={t("editor.action.form.label.tx.secret_key")}
              required
            >
              <Input size="large" {...field} />
            </LabelWithController>
          )
        }}
      />
    </>
  )
}

export default TencentCosConfigElement
