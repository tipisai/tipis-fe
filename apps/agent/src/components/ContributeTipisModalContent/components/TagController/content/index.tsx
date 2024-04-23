import Icon from "@ant-design/icons"
import { Select, Skeleton, Space, Tag } from "antd"
import { debounce } from "lodash-es"
import { FC, useEffect, useRef, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { LoadingIcon } from "@illa-public/icon"
import {
  useLazyGetFuzzySearchHashTagQuery,
  useLazyGetRecommendHashtagQuery,
} from "@/redux/services/hashTagApi"
import { useLazyGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import { IContributeFromFields } from "../../../ContributeContent/interface"
import { TagControllerProps } from "./interface"
import {
  recommendLabelStyle,
  tagContainer,
  tagInputContainerStyle,
  titleStyle,
} from "./style"

export const TagControllerContent: FC<TagControllerProps> = (props) => {
  const { tipisID } = props

  const { t } = useTranslation()
  const { control, setValue } = useFormContext<IContributeFromFields>()

  const [currentHashtags] = useWatch({
    control,
    name: ["hashtags"],
  })

  const currentInputValue = useRef<string>("")
  const [triggerGetRecommendHashtag] = useLazyGetRecommendHashtagQuery()
  const [triggerGetFuzzySearchHashTag] = useLazyGetFuzzySearchHashTagQuery()
  const [triggerGetAgentDetail] = useLazyGetAIAgentMarketplaceInfoQuery()

  const [recommendTags, setRecommendTags] = useState<string[]>([])

  const [searchRecommendTags, setSearchRecommendTags] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const [searchRecommendTagsLoading, setSearchRecommendTagsLoading] =
    useState(false)

  const debounceSearchKeywords = useRef(
    debounce(async (keywords: string) => {
      setSearchRecommendTagsLoading(true)
      try {
        const res = await triggerGetFuzzySearchHashTag(keywords).unwrap()
        if (currentInputValue.current === keywords) {
          setSearchRecommendTags(
            res.match.map((v) => ({
              label: v,
              value: v,
            })),
          )
        }
      } catch (e) {
      } finally {
        setSearchRecommendTagsLoading(false)
      }
    }, 160),
  )

  const handleClickRecommendTag = (tag: string) => {
    if (currentHashtags.includes(tag)) {
      return
    }
    const newTags = [...currentHashtags, tag]
    setValue("hashtags", newTags)
  }

  useEffect(() => {
    triggerGetRecommendHashtag(null)
      .unwrap()
      .then((res) => {
        setRecommendTags(res.hashtags)
        if (currentInputValue.current === "") {
          setSearchRecommendTags(
            res.hashtags.map((v) => ({
              label: v,
              value: v,
            })),
          )
        }
      })
  }, [triggerGetRecommendHashtag])

  useEffect(() => {
    triggerGetAgentDetail({ aiAgentID: tipisID })
      .unwrap()
      .then((res) => {
        setValue("hashtags", res.marketplace.hashtags)
      })
  }, [tipisID, setValue, triggerGetAgentDetail])

  return (
    <Controller
      name="hashtags"
      control={control}
      render={({ field }) => (
        <div css={tagContainer}>
          <div css={titleStyle}>{t("homepage.contribute_modal.tag")}</div>
          <div css={tagInputContainerStyle}>
            <Select
              {...field}
              mode="tags"
              style={{
                width: "100%",
              }}
              loading={searchRecommendTagsLoading}
              options={searchRecommendTags}
              filterOption={(inputValue, option) => {
                if (inputValue === option?.value) {
                  return true
                } else {
                  return searchRecommendTags
                    .map((tag) => tag.value)
                    .includes(option?.value.toString() ?? "")
                }
              }}
              onSearch={(value) => {
                currentInputValue.current = value
                debounceSearchKeywords.current(value as string)
              }}
              notFoundContent={
                searchRecommendTagsLoading ? (
                  <Icon component={LoadingIcon} spin />
                ) : null
              }
              placeholder={t("homepage.contribute_modal.enter_confirm_tag")}
              labelInValue={false}
              showSearch
            />
          </div>
          {searchRecommendTagsLoading ? (
            <Skeleton active />
          ) : (
            recommendTags.length > 0 && (
              <Space wrap>
                <div css={recommendLabelStyle}>
                  {t("homepage.contribute_modal.recommended_tag")}
                </div>
                {recommendTags.map((tag) => (
                  <Tag
                    bordered={currentHashtags.includes(tag) ? false : true}
                    key={tag}
                    onClick={() => handleClickRecommendTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            )
          )}
        </div>
      )}
    />
  )
}
