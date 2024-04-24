import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  IBaseFunction,
  IDownloadAnObjectContent,
} from "@illa-public/public-types"
import LabelWithEditor from "../../../labelWithEditor"

const VersionIDEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IDownloadAnObjectContent>>()
  const { t } = useTranslation()
  return (
    <LabelWithEditor label={t("editor.action.form.label.tx.version_id")}>
      <Controller
        control={control}
        name="content.config.versionID"
        render={({ field }) => {
          return <Input {...field} size="large" />
        }}
      />
    </LabelWithEditor>
  )
}

export default VersionIDEditor
