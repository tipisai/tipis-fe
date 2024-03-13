import { ShareAgentTab } from "@illa-public/invite-modal"

export interface IShareAndContributeModalProps {
  shareDialogVisible: boolean
  contributedDialogVisible: boolean
  defaultShareTag: ShareAgentTab
  setShareDialogVisible: (visible: boolean) => void
  setContributedDialogVisible: (visible: boolean) => void
  setDefaultShareTag: (tag: ShareAgentTab) => void
}
