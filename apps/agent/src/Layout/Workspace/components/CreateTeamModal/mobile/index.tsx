import Icon from "@ant-design/icons"
import { Button, Input, Modal } from "antd"
import { FC } from "react"
import { createPortal } from "react-dom"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { CloseIcon } from "@illa-public/icon"
import ErrorMessage from "@/components/InputErrorMessage"
import { TEAM_IDENTIFY_FORMAT } from "../constants"
import { CreateTeamFields, CreateTeamModalProps } from "../interface"
import {
  descriptionStyle,
  formStyle,
  inviteCodeLabelStyle,
  modalCloseIconStyle,
  modalTitleStyle,
} from "./style"

const CreateTeamMobileModal: FC<CreateTeamModalProps> = (props) => {
  const { loading, onSubmit, onCancel, visible } = props
  const { t } = useTranslation()
  const { handleSubmit, control, formState } =
    useFormContext<CreateTeamFields>()

  if (typeof document === "undefined") return null
  return createPortal(
    <Modal
      footer={false}
      open={visible}
      width="100%"
      maskClosable={false}
      onCancel={onCancel}
      closeIcon={false}
      centered
      style={{
        maxWidth: 400,
      }}
      styles={{
        content: {
          boxShadow: "0 4px 16px rgb(0 0 0 / 8%)",
          border: `1px solid ${getColor("grayBlue", "08")}`,
          overflow: "hidden",
          borderRadius: 8,
        },
        mask: {
          backgroundColor: getColor("white", "05"),
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <div css={modalCloseIconStyle} onClick={onCancel}>
        <Icon component={CloseIcon} />
      </div>
      <form css={formStyle} onSubmit={handleSubmit(onSubmit)}>
        <header css={modalTitleStyle}>{t("homepage.team_modal.title")}</header>
        <section>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                status={!!formState?.errors.name ? "error" : undefined}
                variant="filled"
                placeholder={t("homepage.team_modal.team_name") || ""}
              />
            )}
            rules={{
              required: t("homepage.team_modal.team_name_empty") || "",
            }}
          />
          {formState?.errors.name && (
            <ErrorMessage message={formState?.errors.name?.message} />
          )}
        </section>
        <section>
          <Controller
            name="identifier"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                status={!!formState?.errors.identifier ? "error" : undefined}
                variant="filled"
                placeholder={t("homepage.team_modal.team_domain") || ""}
              />
            )}
            rules={{
              required: t("homepage.team_modal.team_domain_empty") || "",
              pattern: {
                value: TEAM_IDENTIFY_FORMAT,
                message: t("homepage.team_modal.team_domain_invalid_character"),
              },
              maxLength: {
                value: 200,
                message: t("homepage.team_modal.team_domain_invalid_length"),
              },
            }}
          />
          <div css={inviteCodeLabelStyle}>
            <span css={descriptionStyle}>
              {t("homepage.team_modal.tip.team_identifier")}
            </span>
          </div>
          {formState?.errors.identifier && (
            <ErrorMessage message={formState?.errors.identifier?.message} />
          )}
        </section>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={loading}
          block
        >
          {t("homepage.team_modal.create")}
        </Button>
      </form>
    </Modal>,
    document.body,
  )
}

export default CreateTeamMobileModal
