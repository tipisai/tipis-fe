import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { PreviousIcon } from "@illa-public/icon"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { IDetailLayoutProps } from "./interface"
import {
  customRenderTitleStyle,
  detailContentContainerStyle,
  tipiDetailContainerStyle,
} from "./style"

const DetailLayout: FC<IDetailLayoutProps> = (props) => {
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
                Tipi detail
              </Button>
            </div>
          )
        }}
      />
      <div css={detailContentContainerStyle}>{props.children}</div>
    </div>
  )
}
DetailLayout.displayName = "TipiDetailLayout"
export default DetailLayout
