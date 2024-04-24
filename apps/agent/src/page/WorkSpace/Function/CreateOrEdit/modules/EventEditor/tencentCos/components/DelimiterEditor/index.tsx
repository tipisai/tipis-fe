import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { IBaseFunction, IListObjectContent } from "@illa-public/public-types"
import LabelWithEditor from "../../../labelWithEditor"

const DelimiterEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IListObjectContent>>()
  return (
    <LabelWithEditor label="Delimiter">
      <Controller
        control={control}
        name="content.config.delimiter"
        render={({ field }) => {
          return <Input {...field} size="large" />
        }}
      />
    </LabelWithEditor>
  )
}

export default DelimiterEditor
