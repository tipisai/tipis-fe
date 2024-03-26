import { FC } from "react"
import { BaseTag } from "./BaseTag"
import { TagListContainerProps } from "./interface"
import { containerStyle } from "./style"

const TagList: FC<TagListContainerProps> = ({
  tagList,
  activeTag,
  isEmptyRecommend,
  isCardTag,
  limitTagNum,
  handleTagChange,
}) => {
  const handleClickTag = (name: string) => {
    if (isEmptyRecommend) {
      handleTagChange?.(name)
      return
    }
    if (name === activeTag) {
      handleTagChange?.()
    } else {
      handleTagChange?.(name)
    }
  }
  const tagLength = tagList.length

  if (!tagList || tagLength < 1) return null
  return (
    <div css={containerStyle(isEmptyRecommend, isCardTag)}>
      {tagList &&
        tagList
          .slice(0, limitTagNum ?? tagLength)
          .map((name) => (
            <BaseTag
              key={name}
              name={name}
              isActive={name === activeTag}
              handleClick={handleClickTag}
            />
          ))}
      {limitTagNum && tagLength > limitTagNum && (
        <BaseTag name={`+${tagLength - limitTagNum}`} />
      )}
    </div>
  )
}
export default TagList
