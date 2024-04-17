import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { PRESET_OPTION_ID } from "./constants"
import AmyPDFSrc from "./promptFiles/Amy.pdf?url"
import HanaPDFSrc from "./promptFiles/Hana.pdf?url"
import JanePDFSrc from "./promptFiles/Jane.pdf?url"
import TomPDFSrc from "./promptFiles/Tom.pdf?url"
import SalesDataSrc from "./promptFiles/salesData.xlsx?url"

export const useGetPresetOptions = () => {
  const { t } = useTranslation()

  const presetOptions = [
    {
      id: PRESET_OPTION_ID.DATA_ANALYZE,
      title: t("homepage.tipi_chat.default_message.data_analyze.title"),
      description: t("homepage.tipi_chat.default_message.data_analyze.desc"),
    },
    {
      id: PRESET_OPTION_ID.INVOICE_PDF_PROCESS,
      title: t("homepage.tipi_chat.default_message.pdf.title"),
      description: t("homepage.tipi_chat.default_message.pdf.desc"),
    },
    {
      id: PRESET_OPTION_ID.PROCESS_EXCEL_FILES,
      title: t("homepage.tipi_chat.default_message.excel.title"),
      description: t("homepage.tipi_chat.default_message.excel.desc"),
    },
    {
      id: PRESET_OPTION_ID.GENERATE_A_GRAPHIC_REPORT,
      title: t("homepage.tipi_chat.default_message.graphic.title"),
      description: t("homepage.tipi_chat.default_message.graphic.desc"),
    },
  ]

  return presetOptions
}

export const useGetPrompt = () => {
  const { t } = useTranslation()

  const getPromptByID = useCallback(
    async (id: PRESET_OPTION_ID) => {
      switch (id) {
        case PRESET_OPTION_ID.DATA_ANALYZE: {
          return {
            messagePrompt: t(
              "homepage.tipi_chat.default_message.data_analyze.prompt.user",
            ),
            filePrompt: [],
          }
        }
        case PRESET_OPTION_ID.INVOICE_PDF_PROCESS: {
          const fileNameArray = ["Amy.pdf", "Jane.pdf", "Hana.pdf", "Tom.pdf"]
          const filePrompt = await Promise.all([
            fetch(AmyPDFSrc),
            fetch(JanePDFSrc),
            fetch(HanaPDFSrc),
            fetch(TomPDFSrc),
          ])
            .then((responses) =>
              Promise.all(responses.map((res) => res.blob())),
            )
            .then((blobs) =>
              blobs.map(
                (blob, i) =>
                  new File([blob], `${fileNameArray[i]}`, {
                    type: blob.type,
                  }),
              ),
            )

          return {
            messagePrompt: t(
              "homepage.tipi_chat.default_message.pdf.prompt.user",
            ),
            filePrompt,
          }
        }
        case PRESET_OPTION_ID.PROCESS_EXCEL_FILES: {
          const filePrompt = await fetch(SalesDataSrc)
            .then((res) => res.blob())
            .then(
              (blob) =>
                new File([blob], `salesData.xlsx`, {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }),
            )
          return {
            messagePrompt: t(
              "homepage.tipi_chat.default_message.excel.prompt_user",
            ),
            filePrompt: [filePrompt],
          }
        }
        case PRESET_OPTION_ID.GENERATE_A_GRAPHIC_REPORT: {
          const filePrompt = await fetch(SalesDataSrc)
            .then((res) => res.blob())
            .then(
              (blob) =>
                new File([blob], `salesData.xlsx`, {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }),
            )

          return {
            messagePrompt: t(
              "homepage.tipi_chat.default_message.graphic.prompt",
            ),
            filePrompt: [filePrompt],
          }
        }
      }
    },
    [t],
  )

  return getPromptByID
}
