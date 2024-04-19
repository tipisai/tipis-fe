import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { PreviousIcon } from "@illa-public/icon"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { IDetailLayoutProps } from "./interface"
import {
  customRenderTitleStyle,
  detailContentContainerStyle,
  scrollContainerStyle,
  tipiDetailContainerStyle,
} from "./style"

const DetailLayout: FC<IDetailLayoutProps> = (props) => {
  const { t } = useTranslation()
  return (
    <div css={tipiDetailContainerStyle}>
      <WorkspacePCHeaderLayout
        title={`${props.title}-Detail`}
        customRenderTitle={() => {
          return (
            <div css={customRenderTitleStyle}>
              <Button
                type="text"
                icon={<Icon component={PreviousIcon} />}
                size="large"
                onClick={props.onClickBack}
              >
                {t("homepage.tipi_dashboard.title.tipi_dashboard")}
              </Button>
            </div>
          )
        }}
      />
      <div css={scrollContainerStyle}>
        <div css={detailContentContainerStyle}>{props.children}</div>
      </div>
    </div>
  )
}
DetailLayout.displayName = "TipiDetailLayout"
export default DetailLayout
