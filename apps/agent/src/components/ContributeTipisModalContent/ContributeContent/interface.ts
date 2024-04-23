export interface IContributeFromFields {
  publishConfiguration: boolean
  hashtags: string[]
  contributeToMarketplace: boolean
}

export interface IContributeTipisModalContentProps {
  isContribute: boolean
  tipisID: string
  contributeCallback: (
    publishedToMarketplace: boolean,
    successModalType?: "contribute" | "update",
  ) => void
}
