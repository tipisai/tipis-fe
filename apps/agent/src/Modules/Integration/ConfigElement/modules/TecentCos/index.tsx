import { Input, Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { ITencentCosIntegration } from "@illa-public/public-types"
import LabelWithController from "../../components/LabelWithController"
import { regionOptions } from "./constants"

const TencentCosConfigElement: FC = () => {
  const { control } = useFormContext<ITencentCosIntegration>()
  return (
    <>
      <Controller
        name="resourceName"
        control={control}
        render={({ field }) => {
          return (
            <LabelWithController title="Name">
              <Input size="large" {...field} />
            </LabelWithController>
          )
        }}
      />
      <Controller
        name="content.bucketName"
        control={control}
        render={({ field }) => {
          return (
            <LabelWithController title="Bucket name">
              <Input size="large" {...field} />
            </LabelWithController>
          )
        }}
      />
      <Controller
        name="content.region"
        control={control}
        render={({ field }) => {
          return (
            <LabelWithController title="Region">
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
        render={({ field }) => {
          return (
            <LabelWithController title="SecretID">
              <Input size="large" {...field} />
            </LabelWithController>
          )
        }}
      />
      <Controller
        name="content.secretAccessKey"
        control={control}
        render={() => {
          return (
            <LabelWithController title="SecretKey">
              <Input size="large" />
            </LabelWithController>
          )
        }}
      />
    </>
  )
}

export default TencentCosConfigElement
