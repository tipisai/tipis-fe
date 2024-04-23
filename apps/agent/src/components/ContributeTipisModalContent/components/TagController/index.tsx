import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  IContributeFromFields,
  IContributeTipisModalContentProps,
} from "../../ContributeContent/interface"
import { TagControllerContent } from "./content"

const TagController: FC<
  Pick<IContributeTipisModalContentProps, "isContribute" | "tipisID">
> = ({ isContribute, tipisID }) => {
  const { control } = useFormContext<IContributeFromFields>()
  const [contributeToMarketplace] = useWatch({
    control,
    name: ["contributeToMarketplace"],
  })
  if (isContribute && !contributeToMarketplace) return null
  return <TagControllerContent tipisID={tipisID} />
}

export default TagController
