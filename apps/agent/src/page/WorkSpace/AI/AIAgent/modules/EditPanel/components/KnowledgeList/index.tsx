import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import { Agent, IKnowledgeFile } from "@illa-public/public-types"
import LayoutBlock from "../../../../../../../../Layout/Form/LayoutBlock"
import KnowledgeUpload from "../../../../../components/KnowledgeUpload"
import { SCROLL_ID } from "../../../../interface"

const KnowledgeList: FC = memo(() => {
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
        <LayoutBlock title={t("knowledge")} scrollId={SCROLL_ID.KNOWLEDGE}>
          <KnowledgeUpload
            addFile={(file: IKnowledgeFile, isUpdate?: boolean) => {
              const { name, type } = file
              const files = field.value || []
              const index = files.findIndex(
                (item) => item.name === name && item.type === type,
              )
              if (index !== -1) {
                if (isUpdate) {
                  let needUpdateFile = files[index]
                  files.splice(index, 1, {
                    ...needUpdateFile,
                    ...file,
                  })
                } else {
                  const fileNamePrefix = `${
                    file.name.split(".")[0]
                  }(${v4().slice(0, 3)})`

                  files.push({
                    ...file,
                    name: `${fileNamePrefix}.${file.name.split(".")?.[1]}`,
                  })
                }
              } else {
                files.push(file)
              }
              field.onChange(files)
            }}
            removeFile={(name: string) => {
              const currentFiles = field.value || []
              const files = currentFiles.filter((item) => item.name !== name)
              field.onChange(files)
            }}
            values={field.value}
          />
        </LayoutBlock>
      )}
    />
  )
})

KnowledgeList.displayName = "KnowledgeList"

export default KnowledgeList
