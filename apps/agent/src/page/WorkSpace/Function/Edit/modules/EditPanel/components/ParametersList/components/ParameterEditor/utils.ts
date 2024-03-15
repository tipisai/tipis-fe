import { IResourceVariable } from "@illa-public/public-types"

export interface IDataWithPath extends IResourceVariable {
  path: string[]
}

export function addPath(
  data: IResourceVariable[],
  parentPath: string[] = [],
): IDataWithPath[] {
  const newData: IDataWithPath[] = []

  data.forEach((item) => {
    const path = [...parentPath, item.id]
    newData.push({ ...item, path })

    if (item.item) {
      newData.push(...addPath(item.item, path))
    }
  })

  return newData
}
