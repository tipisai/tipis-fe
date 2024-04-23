import { css } from "@emotion/react"

export const modalStyle = css`
  & .ant-modal-confirm-paragraph {
    max-width: 100% !important;
  }
  & .ant-modal-content {
    padding: 0;
  }
  & .ant-modal-confirm-title {
    display: flex;
    width: 100%;
    padding: 16px 24px 16px 20px;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }
  & .ant-modal-confirm-content {
    padding: 8px 24px 24px 24px;
  }
`
