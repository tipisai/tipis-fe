import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { IBaseFunction, IListObjectContent } from "@illa-public/public-types"
import LabelWithEditor from "../../../labelWithEditor"

const PrefixEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IListObjectContent>>()
  return (
    <LabelWithEditor label="Prefix">
      <Controller
        control={control}
        name="content.config.prefix"
        render={({ field }) => {
          return <Input {...field} size="large" />
        }}
      />
    </LabelWithEditor>
  )
}

export default PrefixEditor
