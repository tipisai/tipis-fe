import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IBaseFunction, IListObjectContent } from "@illa-public/public-types"
import LabelWithEditor from "../../../labelWithEditor"

const DelimiterEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IListObjectContent>>()
  const { t } = useTranslation()
  return (
    <LabelWithEditor label={t("editor.action.form.label.tx.delimiter")}>
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
