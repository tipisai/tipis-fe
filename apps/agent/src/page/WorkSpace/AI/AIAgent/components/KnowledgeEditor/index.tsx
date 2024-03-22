import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Agent, IKnowledgeFile } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { SCROLL_ID } from "@/page/WorkSpace/AI/AIAgent/interface"
import KnowledgeUpload from "@/page/WorkSpace/AI/components/KnowledgeUpload"

const KnowledgeEditor: FC = memo(() => {
  const { t } = useTranslation()

  const methods = useFormContext<Agent>()

  return (
    <Controller
      name="knowledge"
      control={methods.control}
      rules={{
        validate: (value) => {
          const isValidate =
            !value ||
            value.length === 0 ||
            value.every((param) => param.value !== "")
          return isValidate ? isValidate : t("")
        },
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          title={t("homepage.tipi_detail.label.knowledge")}
          scrollId={SCROLL_ID.KNOWLEDGE}
        >
          <KnowledgeUpload
            addFile={(file: IKnowledgeFile) => {
              const files = field.value || []
              files.push(file)
              field.onChange(files)
            }}
            removeFile={(name: string) => {
              const currentFiles = field.value || []
              const files = currentFiles.filter(
                (item) => item.fileName !== name,
              )
              field.onChange(files)
            }}
            values={field.value}
          />
        </LayoutBlock>
      )}
    />
  )
})

KnowledgeEditor.displayName = "KnowledgeEditor"

export default KnowledgeEditor
