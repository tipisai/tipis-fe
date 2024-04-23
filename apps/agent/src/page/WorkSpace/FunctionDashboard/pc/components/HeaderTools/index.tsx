import Icon from "@ant-design/icons"
import { Button, Input, Modal } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { TIntegrationType } from "@illa-public/public-types"
import { IntegrationTypeSelector } from "@/Modules/Integration/IntegrationSelector"
import { useCreateFunction } from "@/utils/recentTabs/hook"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const createFunction = useCreateFunction()
  const [canShowModal, setShowModal] = useState(false)
  const { t } = useTranslation()

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

      <Modal
        open={canShowModal}
        destroyOnClose
        width={1080}
        footer={false}
        title={t("editor.action.modal.title")}
        onCancel={() => {
          setShowModal(false)
        }}
      >
        <IntegrationTypeSelector
          onSelect={function (item: TIntegrationType): void {
            createFunction(item)
          }}
        />
      </Modal>
    </>
  )
}

export default HeaderTools
