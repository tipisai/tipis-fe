import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import {
  IBaseFunction,
  IDownloadAnObjectContent,
} from "@illa-public/public-types"
import LabelWithEditor from "../../../labelWithEditor"

const ObjectNameEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IDownloadAnObjectContent>>()
  return (
    <LabelWithEditor label="Object name">
      <Controller
        control={control}
        name="content.config.objectName"
        render={({ field }) => {
          return <Input {...field} size="large" />
        }}
      />
    </LabelWithEditor>
  )
}

export default ObjectNameEditor
