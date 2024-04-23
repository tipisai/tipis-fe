import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { DocsIcon } from "@illa-public/icon"
import CopyPanel from "../../components/CopyPanel"
import { blockStyle, descStyle, docPanelStyle, titleStyle } from "./style"

const DocPanel: FC = () => {
  const { t } = useTranslation()
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
          title="Prompt"
          copyButtonText={t("function.edit.right_panel.copy_prompt")}
          content={t("function.edit.right_panel.example_prompt")}
        />
      </div>
      <div css={blockStyle}>
        <p css={titleStyle}>{t("function.edit.right_panel.allowlist")}</p>
        <p css={descStyle}>{t("function.edit.right_panel.for_example")}</p>
        <CopyPanel
          title="IP"
          copyButtonText={t("function.edit.right_panel.copy_ip")}
          content={`52.177.12.28/32\n
            52.175.251.223/32\n
            35.90.103.132/30\n
            44.208.168.68/30\n
            52.177.12.28/32\n
            52.175.251.223/32\n
            35.90.103.132/30`}
        />
      </div>
    </div>
  )
}

export default DocPanel
