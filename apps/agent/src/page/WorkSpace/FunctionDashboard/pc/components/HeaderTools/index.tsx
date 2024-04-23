import Icon from "@ant-design/icons"
import { Button, Input, Modal } from "antd"
import { FC, useState } from "react"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { ResourceTypeSelector } from "@illa-public/integration-selector"
import { TIntegrationType } from "@illa-public/public-types"
import { useCreateFunction } from "@/utils/recentTabs/hook"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const createFunction = useCreateFunction()
  const [canShowModal, setShowModal] = useState(false)

  const handleClickCreateFunction = () => {
    setShowModal(true)
    // modal.info({
    //   title: "Create",
    //   icon: null,
    //   width: 1080,
    //   content: (

    //   ),
    // })
  }

  return (
    <>
      <div css={headerToolsContainerStyle}>
        <Input
          placeholder="Search"
          prefix={<Icon component={SearchIcon} />}
          size="large"
        />
        <Button
          type="primary"
          icon={<Icon component={PlusIcon} />}
          size="large"
          onClick={handleClickCreateFunction}
        >
          Create
        </Button>
      </div>

      <Modal open={canShowModal} destroyOnClose width={1080} footer={false}>
        <ResourceTypeSelector
          onSelect={function (item: TIntegrationType): void {
            createFunction(item)
          }}
        />
      </Modal>
    </>
  )
}

export default HeaderTools
