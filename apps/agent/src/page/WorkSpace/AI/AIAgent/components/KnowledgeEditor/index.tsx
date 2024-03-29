import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Agent, IKnowledgeFile } from "@illa-public/public-types"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { SCROLL_ID } from "@/page/WorkSpace/AI/AIAgent/interface"
import KnowledgeUpload from "@/page/WorkSpace/AI/components/KnowledgeUpload"
import { editPanelUpdateFileDetailStore } from "@/utils/drive"
import { descStyle } from "./style"

const KnowledgeEditor: FC = memo(() => {
  const { t } = useTranslation()

  const methods = useFormContext<Agent>()
  const { errors } = useFormState({
    control: methods.control,
  })

  return (
    <Controller
      name="knowledge"
      control={methods.control}
      rules={{
        validate: () => {
          const isValidate = !editPanelUpdateFileDetailStore.hasPendingFile()
          return isValidate
            ? isValidate
            : t("dashboard.message.parsing_file_in_prog")
        },
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          title={t("homepage.edit_tipi.modal.knowledge")}
          scrollId={SCROLL_ID.KNOWLEDGE}
        >
          <span css={descStyle}>
            {t("homepage.edit_tipi.caption.knowledge")}
          </span>
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
          {errors.knowledge?.message && (
            <ErrorText errorMessage={errors.knowledge?.message} />
          )}
        </LayoutBlock>
      )}
    />
  )
})

KnowledgeEditor.displayName = "KnowledgeEditor"

export default KnowledgeEditor
