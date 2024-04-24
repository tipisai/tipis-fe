import Icon from "@ant-design/icons"
import { Button, Skeleton } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { DocsIcon } from "@illa-public/icon"
import { useGetWhiteListIPQuery } from "@/redux/services/peripheralAPI"
import { useCopyToClipboard } from "@/utils/copyToClipboard"
import CopyPanel from "../../components/CopyPanel"
import { blockStyle, descStyle, docPanelStyle, titleStyle } from "./style"

const DocPanel: FC = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useGetWhiteListIPQuery()
  const copyToClipboard = useCopyToClipboard()

  const onClickCopyPrompt = () => {}

  const onClickCopyIP = () => {
    if (!data) return
    copyToClipboard(data.resources.join("\n"))
  }

  return (
    <div css={docPanelStyle}>
      <Button icon={<Icon component={DocsIcon} />}>
        {t("homepage.left_panel.setting.documentation")}
      </Button>
      <div css={blockStyle}>
        <p css={titleStyle}>{t("function.edit.right_panel.add_to_tipi")}</p>
      </div>
      <div css={blockStyle}>
        <p css={titleStyle}>{t("function.edit.right_panel.write_in_prompt")}</p>
        <p css={descStyle}>{t("function.edit.right_panel.for_example")}</p>
        <CopyPanel
          onClickCopyButton={onClickCopyPrompt}
          title="Prompt"
          copyButtonProps={{
            text: t("function.edit.right_panel.copy_prompt"),
          }}
          content={t("function.edit.right_panel.example_prompt")}
        />
      </div>
      <div css={blockStyle}>
        <p css={titleStyle}>{t("function.edit.right_panel.allowlist")}</p>
        <p css={descStyle}>{t("function.edit.right_panel.for_example")}</p>
        <CopyPanel
          title="IP"
          copyButtonProps={{
            text: t("function.edit.right_panel.copy_ip"),
            disabled: !data,
          }}
          onClickCopyButton={onClickCopyIP}
          content={
            isLoading ? (
              <Skeleton
                title={false}
                active
                paragraph={{
                  rows: 3,
                }}
              />
            ) : (
              data?.resources.map((ip) => <p key={ip}>{ip}</p>)
            )
          }
        />
      </div>
    </div>
  )
}

export default DocPanel
