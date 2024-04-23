import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  IContributeFromFields,
  IContributeTipisModalProps,
} from "../../ContributeContent/interface"
import { TagControllerContent } from "./content"

const TagController: FC<Pick<IContributeTipisModalProps, "isContribute">> = ({
  isContribute,
}) => {
  const { control } = useFormContext<IContributeFromFields>()
  const [contributeToMarketplace] = useWatch({
    control,
    name: ["contributeToMarketplace"],
  })
  if (isContribute && !contributeToMarketplace) return null
  return <TagControllerContent />
}

export default TagController
