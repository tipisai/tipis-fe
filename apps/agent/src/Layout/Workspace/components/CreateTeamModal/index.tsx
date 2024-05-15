import { App } from "antd"
import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  FREE_TEAM_LIMIT_TYPE,
  handleFreeTeamLimitError,
} from "@illa-public/upgrade-modal"
import { useCreateTeamMutation } from "@illa-public/user-data"
import { setLocalTeamIdentifier } from "@/utils/storage/cacheTeam"
import { CreateTeamFields } from "./interface"
import CreateTeamMobileModal from "./mobile"
import CreateTeamPCModal from "./pc"

interface CreateTeamModalProps {
  visible: boolean
  onCancel?: () => void
}

const CreateTeamModal: FC<CreateTeamModalProps> = (props) => {
  const { t } = useTranslation()
  const { message } = App.useApp()
  const { visible, onCancel } = props
  const navigate = useNavigate()

  const [createTeam] = useCreateTeamMutation()

  const createFormProps = useForm<CreateTeamFields>({})
  const [loading, setLoading] = useState(false)

  const onCloseCreateModal = () => {
    onCancel?.()
    createFormProps.reset({})
  }

  const onSubmitCreateTeam: SubmitHandler<CreateTeamFields> = async (data) => {
    try {
      setLoading(true)
      const res = await createTeam(data).unwrap()
      onCloseCreateModal()
      message.success({
        content: t("team_create_suc"),
      })

      setLocalTeamIdentifier(res.identify)
      navigate(`/workspace/${res.identify}`, { replace: true })
    } catch (e) {
      if (isILLAAPiError(e)) {
        const res = handleFreeTeamLimitError(e, FREE_TEAM_LIMIT_TYPE.CREATE)
        if (res) return
        switch (e?.data?.errorFlag) {
          case ERROR_FLAG.ERROR_FLAG_TEAM_IDENTIFIER_HAS_BEEN_TAKEN:
            message.error({
              content: t("page.user.sign_in.tips.fail_account"),
            })

            break
          case ERROR_FLAG.ERROR_FLAG_PROMOTE_CODE_ALREADY_USED:
            message.error({
              content: t("team.create.fail_invite_code_used"),
            })
            break
          case ERROR_FLAG.ERROR_FLAG_CAN_NOT_GET_PROMOTE_CODE:
          case ERROR_FLAG.ERROR_FLAG_PARSE_REQUEST_BODY_FAILED:
            message.error({
              content: t("team.create.error_invite_code"),
            })

            break
          case ERROR_FLAG.ERROR_FLAG_CAN_NOT_CREATE_TEAM:
            message.error({
              content: t("team.create.fail_same_identifier"),
            })
            break
          default:
            message.error({
              content: t("team_create_fail"),
            })
            break
        }
      }
      message.error({
        content: t("team_create_fail"),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormProvider {...createFormProps}>
      <LayoutAutoChange
        desktopPage={
          <CreateTeamPCModal
            loading={loading}
            visible={visible}
            onCancel={onCloseCreateModal}
            onSubmit={onSubmitCreateTeam}
          />
        }
        mobilePage={
          <CreateTeamMobileModal
            loading={loading}
            visible={visible}
            onCancel={onCloseCreateModal}
            onSubmit={onSubmitCreateTeam}
          />
        }
      />
    </FormProvider>
  )
}

CreateTeamModal.displayName = "CreateTeamModal"

export default CreateTeamModal
