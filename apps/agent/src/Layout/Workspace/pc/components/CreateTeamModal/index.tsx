import { App } from "antd"
import { FC, useContext, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import {
  FREE_TEAM_LIMIT_TYPE,
  handleFreeTeamLimitError,
} from "@illa-public/upgrade-modal"
import {
  useCreateTeamMutation,
  useGetUserInfoAndTeamsInfoByTokenQuery,
} from "@illa-public/user-data"
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
  const { data: cacheData } = useGetUserInfoAndTeamsInfoByTokenQuery({})

  const [createTeam] = useCreateTeamMutation()

  const createFormProps = useForm<CreateTeamFields>({})
  const [loading, setLoading] = useState(false)
  const { track } = useContext(MixpanelTrackContext)

  const onCloseCreateModal = () => {
    onCancel?.()
    createFormProps.reset({})
  }

  const onSubmitCreateTeam: SubmitHandler<CreateTeamFields> = async (data) => {
    try {
      setLoading(true)
      await createTeam(data).unwrap()
      onCloseCreateModal()
      message.success({
        content: t("team_create_suc"),
      })
      track?.(ILLA_MIXPANEL_EVENT_TYPE.REQUEST, {
        element: "team_modal_create_button",
        parameter2: "suc",
      })
      const currentTeamIdentifier = cacheData?.teams.find(
        (team) => team.id === res.currentTeamID,
      )?.identifier

      const url = currentTeamIdentifier
        ? `/workspace/${currentTeamIdentifier}`
        : "/workspace"

      navigate(url, { replace: true })
    } catch (e) {
      if (isILLAAPiError(e)) {
        const res = handleFreeTeamLimitError(e, FREE_TEAM_LIMIT_TYPE.CREATE)
        if (res) return
        switch (e?.data?.errorFlag) {
          case ERROR_FLAG.ERROR_FLAG_TEAM_IDENTIFIER_HAS_BEEN_TAKEN:
            message.error({
              content: t("page.user.sign_in.tips.fail_account"),
            })
            track?.(ILLA_MIXPANEL_EVENT_TYPE.REQUEST, {
              element: "team_modal_create_button",
              parameter2: "failed",
              parameter3: "existed_identify",
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
            track?.(ILLA_MIXPANEL_EVENT_TYPE.REQUEST, {
              element: "team_modal_create_button",
              parameter2: "failed",
              parameter3: "invalid_invitation_code",
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
