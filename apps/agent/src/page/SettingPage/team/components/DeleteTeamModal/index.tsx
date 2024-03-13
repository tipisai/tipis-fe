import { App, Input, Modal } from "antd"
import { FC, useContext, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentMemberList,
  getCurrentTeamInfo,
  teamActions,
  useDeleteTeamByIDMutation,
} from "@illa-public/user-data"
import {
  descStyle, // mobileModalButtonStyle,
  mobileModalContentStyle, // mobileModalStyle,
  mobileModalTitleStyle,
} from "./style"

interface DeleteTeamModalProps {
  visible: boolean
  onCancel: () => void
}

const DeleteTeamModal: FC<DeleteTeamModalProps> = (props) => {
  const { visible, onCancel } = props
  const { t } = useTranslation()
  const { message } = App.useApp()
  const teamInfo = useSelector(getCurrentTeamInfo)
  const memberList = useSelector(getCurrentMemberList)
  const { control, formState, trigger, watch, reset } = useForm<{
    name: string
  }>({
    mode: "onSubmit",
    criteriaMode: "firstError",
  })
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
        parameter4: memberList?.length,
        team_id: teamInfo?.identifier || "-1",
      },
      "team_id",
    )
    if (result) {
      track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
        element: "delete_modal_delete",
        parameter1: "delete_select",
        parameter4: memberList?.length,
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

  const config = {
    title: t("team_setting.delete_modal.title"),
    description: t("team_setting.leave_modal.description"),
    okText: t("team_setting.delete_modal.delete"),
    cancelText: t("team_setting.delete_modal.cancel"),
    onOk: removeTeamMember,
  }

  return (
    <LayoutAutoChange
      desktopPage={
        <Modal
          open={visible}
          title={config.title}
          okText={config.okText}
          cancelText={config.cancelText}
          okButtonProps={{
            danger: true,
            disabled,
          }}
          onOk={config.onOk}
          onCancel={handleOnCancel}
          closable
        >
          <span css={descStyle}>{config.description}</span>
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
        </Modal>
      }
      mobilePage={
        <Modal
        // _css={mobileModalStyle}
        // withoutPadding
        // okText={config.okText}
        // cancelText={config.cancelText}
        // cancelButtonProps={{ _css: mobileModalButtonStyle }}
        // okButtonProps={{
        //   _css: mobileModalButtonStyle,
        //   variant: "light",
        //   colorScheme: "red",
        //   disabled,
        // }}
        // onOk={config.onOk}
        // onCancel={handleOnCancel}
        // {...rest}
        >
          <div css={mobileModalTitleStyle}>{config.title}</div>
          <div css={mobileModalContentStyle}>{config.description}</div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                status={!!formState?.errors.name ? "error" : undefined}
                variant="filled"
                placeholder={t("team_setting.team_info.team_name_placeholder")}
                autoComplete="off"
              />
            )}
            rules={{
              required: t("team_setting.team_info.team_name_empty"),
            }}
          />
        </Modal>
      }
    />
  )
}

DeleteTeamModal.displayName = "DeleteTeamModal"

export default DeleteTeamModal
