export interface IContributeFromFields {
  publishConfiguration: boolean
  hashtags: string[]
  contributeToMarketplace: boolean
}

export interface IContributeTipisModalProps {
  visible: boolean
  isContribute: boolean
  tipisID: string
  contributeCallback: (
    publishedToMarketplace: boolean,
    successModalType?: "contribute" | "update",
  ) => void
  closeModal: () => void
}
