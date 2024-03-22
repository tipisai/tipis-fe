import { Divider } from "antd"
import { FC } from "react"
import FeatureArea from "@/Layout/Workspace/modules/FeatureArea"
import MenuFooter from "../../../modules/MenuFooter"
import MenuHeader from "../MenuHeader"
import {
  dividerContainerStyle,
  menuContainerStyle,
  menuContentStyle,
  menuInnerContainerStyle,
} from "./style"

interface EmptyTeamMenuPCProps {
  openCreateModal: () => void
}

const EmptyTeamMenuPC: FC<EmptyTeamMenuPCProps> = ({ openCreateModal }) => {
  return (
    <>
      <section css={menuContainerStyle}>
        <div css={menuInnerContainerStyle}>
          <div css={menuContentStyle}>
            <MenuHeader />
            <FeatureArea openCreateModal={openCreateModal} />
            <div css={dividerContainerStyle}>
              <Divider
                style={{
                  margin: "0",
                }}
              />
            </div>
          </div>
          <MenuFooter />
        </div>
      </section>
    </>
  )
}

export default EmptyTeamMenuPC
