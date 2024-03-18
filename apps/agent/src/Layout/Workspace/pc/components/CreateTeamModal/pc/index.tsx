import Icon from "@ant-design/icons"
import { Button, Input, Modal } from "antd"
import { FC } from "react"
import { createPortal } from "react-dom"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { CloseIcon } from "@illa-public/icon"
import createTeamBg from "@/assets/workspace/create-team-bg.svg"
import ErrorMessage from "@/components/InputErrorMessage"
import { TEAM_IDENTIFY_FORMAT } from "../constants"
import { CreateTeamFields, CreateTeamModalProps } from "../interface"
import {
  descriptionStyle,
  formHeaderStyle,
  formLabelStyle,
  formStyle,
  gridFormFieldStyle,
  gridItemStyle,
  inviteCodeLabelStyle,
  modalCloseIconStyle,
  modalDecorateLeftStyle,
  modalDecorateRightStyle,
  requireStyle,
} from "./style"

const CreateTeamPCModal: FC<CreateTeamModalProps> = (props) => {
  const { loading, onSubmit, onCancel, visible } = props
  const { t } = useTranslation()
  const { handleSubmit, control, formState } =
    useFormContext<CreateTeamFields>()

  if (typeof document === "undefined") return null
  return createPortal(
    <Modal
      width="100%"
      style={{
        maxWidth: "746px",
        padding: 0,
      }}
      styles={{
        content: {
          border: "unset",
          background: `#f7fff9 url(${createTeamBg}) no-repeat`,
          backgroundPosition: "bottom",
          minHeight: "540px",
          borderRadius: "16px",
          boxShadow: "0px 4px 16px rgb(0 0 0 / 8%)",
        },
        mask: {
          backgroundColor: getColor("white", "05"),
          backdropFilter: "blur(5px)",
        },
      }}
      maskClosable={false}
      footer={false}
      closeIcon={false}
      onCancel={onCancel}
      open={visible}
      centered
    >
      <div css={modalCloseIconStyle} onClick={onCancel}>
        <Icon component={CloseIcon} />
      </div>
      <div css={modalDecorateLeftStyle} />
      <div css={modalDecorateRightStyle} />
      <form css={formStyle} onSubmit={handleSubmit(onSubmit)}>
        <header css={formHeaderStyle}>{t("homepage.team_modal.title")}</header>
        <section css={gridFormFieldStyle}>
          <section css={gridItemStyle}>
            <label css={[formLabelStyle, requireStyle]}>
              {t("homepage.team_modal.team_name")}
            </label>
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    status={!!formState?.errors.name ? "error" : undefined}
                    variant="filled"
                  />
                )}
                rules={{
                  required: t("homepage.team_modal.team_name_empty") || "",
                }}
              />
              {formState?.errors.name && (
                <ErrorMessage message={formState?.errors.name?.message} />
              )}
            </div>
          </section>
          <section css={gridItemStyle}>
            <div css={inviteCodeLabelStyle}>
              <label css={[formLabelStyle, requireStyle]}>
                {t("homepage.team_modal.team_domain")}
              </label>
              <label css={descriptionStyle}>
                {t("homepage.team_modal.tip.team_identifier")}
              </label>
            </div>
            <div>
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    status={
                      !!formState?.errors.identifier ? "error" : undefined
                    }
                    variant="filled"
                  />
                )}
                rules={{
                  required: t("homepage.team_modal.team_domain_empty") || "",
                  pattern: {
                    value: TEAM_IDENTIFY_FORMAT,
                    message: t(
                      "homepage.team_modal.team_domain_invalid_character",
                    ),
                  },
                  maxLength: {
                    value: 200,
                    message: t(
                      "homepage.team_modal.team_domain_invalid_length",
                    ),
                  },
                }}
              />
              {formState?.errors.identifier && (
                <ErrorMessage message={formState?.errors.identifier?.message} />
              )}
            </div>
          </section>
          <Button
            loading={loading}
            type="primary"
            size="large"
            htmlType="submit"
            block
          >
            {t("homepage.team_modal.create")}
          </Button>
        </section>
      </form>
    </Modal>,
    document.body,
  )
}

export default CreateTeamPCModal
