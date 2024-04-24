import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IBaseFunction, IListObjectContent } from "@illa-public/public-types"
import LabelWithEditor from "../../../../components/labelWithEditor"

const PrefixEditor: FC = () => {
  const { control } = useFormContext<IBaseFunction<IListObjectContent>>()
  const { t } = useTranslation()
  return (
    <LabelWithEditor
      label={t("editor.action.form.label.tx.prefix")}
      description={t("editor.action.form.tips.tx.prefix")}
    >
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
