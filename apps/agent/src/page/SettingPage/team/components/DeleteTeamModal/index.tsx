import { App, Button, Input, Modal } from "antd"
import { FC, useContext, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getColor } from "@illa-public/color-scheme"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  teamActions,
  useDeleteTeamByIDMutation,
} from "@illa-public/user-data"
import { footerStyle, modalContentStyle, modalTitleStyle } from "./style"

interface DeleteTeamModalProps {
  visible: boolean
  onCancel: () => void
}

const DeleteTeamModal: FC<DeleteTeamModalProps> = (props) => {
  const { visible, onCancel } = props
  const { t } = useTranslation()
  const { message } = App.useApp()
  const teamInfo = useSelector(getCurrentTeamInfo)
  const { control, trigger, watch, reset } = useForm<{
    name: string
  }>({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { name } = watch()
  const { track } = useContext(MixpanelTrackContext)
  const disabled = useMemo(() => {
    return !(name === teamInfo?.name)
  }, [name, teamInfo?.name])

  const [deleteTeamByID] = useDeleteTeamByIDMutation()

  const removeTeamMember = async () => {
    const result = await trigger("name")
    track?.(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      {
        element: "delete",
        parameter1:
          teamInfo?.myRole === USER_ROLE.OWNER ? "delete_button" : undefined,
        team_id: teamInfo?.identifier || "-1",
      },
      "team_id",
    )
    if (result) {
      track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
        element: "delete_modal_delete",
        parameter1: "delete_select",
      })
      deleteTeamByID(teamInfo?.id || "")
        .unwrap()
        .then(() => {
          message.success({
            content: t("team_setting.mes.delete_suc"),
          })
          navigate("/workspace", { replace: true })
          dispatch(teamActions.deleteTeamInfoReducer())
        })
        .catch((e) => {
          if (isILLAAPiError(e)) {
            switch (e.data.errorFlag) {
              case ERROR_FLAG.ERROR_FLAG_CAN_NOT_DELETE_TEAM_DUE_TO_LICENSE_REMAINS: {
                message.error({
                  content: t("billing.message.in_subscription_can_not_delete"),
                })
                return
              }
            }
          }
          message.error({
            content: t("team_setting.mes.delete_fail"),
          })
        })
    }
  }

  const handleOnCancel = () => {
    track?.(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      {
        element: "delete_modal_cancel",
      },
      "team_id",
    )
    onCancel?.()
    reset()
  }

  return (
    <Modal
      open={visible}
      styles={{
        content: {
          padding: 0,
        },
        mask: {
          backgroundColor: getColor("white", "05"),
          backdropFilter: "blur(5px)",
        },
        footer: {
          margin: 0,
        },
      }}
      centered
      onCancel={handleOnCancel}
      footer={false}
      closeIcon={false}
    >
      <div css={modalTitleStyle}>{t("team_setting.delete_modal.title")}</div>
      <div css={modalContentStyle}>
        <span>{t("team_setting.leave_modal.description")}</span>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              size="large"
              variant="filled"
              placeholder={t("team_setting.team_info.team_name_placeholder")}
              autoComplete="off"
            />
          )}
          rules={{
            required: t("team_setting.team_info.team_name_empty"),
          }}
        />
      </div>
      <div css={footerStyle}>
        <Button block onClick={handleOnCancel}>
          {t("team_setting.delete_modal.cancel")}
        </Button>
        <Button
          block
          danger
          type="primary"
          disabled={disabled}
          onClick={removeTeamMember}
        >
          {t("team_setting.delete_modal.delete")}
        </Button>
      </div>
    </Modal>
  )
}

export default DeleteTeamModal
