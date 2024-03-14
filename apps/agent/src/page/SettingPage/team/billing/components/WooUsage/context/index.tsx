import dayjs from "dayjs"
import {
  FC,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import {
  getCurrentTeamInfo,
  useLazyGetWooUsageInfoQuery,
} from "@illa-public/user-data"
import { DATE_FORMAT, LABEL_CONFIG } from "../constants"
import { UsageContextProps, UsageContextProviderProps } from "./interface"

export const UsageContext = createContext<UsageContextProps>(
  {} as UsageContextProps,
)

export const UsageProvider: FC<UsageContextProviderProps> = (props) => {
  const { t } = useTranslation()
  const teamInfo = useSelector(getCurrentTeamInfo)
  const [dataNums, setsDataNums] = useState<number[]>([0, 0, 0])
  const [allNum, setAllNum] = useState<number>(0)
  const [percentNum, setPercentNum] = useState<number[]>([0, 0, 0])
  const [loading, setLoading] = useState(false)

  const [triggerGetWooUsageInfo] = useLazyGetWooUsageInfoQuery()

  const translationLabelName = useMemo(() => {
    return LABEL_CONFIG.NAME.map((item) => t(item))
  }, [t])

  const usageData = {
    labels: translationLabelName,
    datasets: [
      {
        data: dataNums,
        backgroundColor: LABEL_CONFIG.COLOR,
      },
    ],
  }

  const handleDateChange = useCallback(
    async (date?: string) => {
      if (!teamInfo?.id || !date) return
      setLoading(true)
      const fromDate = new Date(date)
      const endDate = new Date(date)
      endDate.setMonth(endDate.getMonth() + 1)
      try {
        const res = await triggerGetWooUsageInfo({
          teamID: teamInfo?.id,
          fromDate: dayjs(fromDate).format(DATE_FORMAT),
          toDate: dayjs(endDate).format(DATE_FORMAT),
        }).unwrap()
        if (res) {
          const {
            aiTokenGeneralUsage = 0,
            driveVolumeUsage = 0,
            driveTrafficUsage = 0,
            totalCollaUsage = 0,
            aiTokenGeneralUsagePercent = 0,
            driveVolumeUsagePercent = 0,
            driveTrafficUsagePercent = 0,
          } = res
          setsDataNums([
            aiTokenGeneralUsage,
            driveVolumeUsage,
            driveTrafficUsage,
          ])
          setAllNum(totalCollaUsage)
          setPercentNum([
            aiTokenGeneralUsagePercent,
            driveVolumeUsagePercent,
            driveTrafficUsagePercent,
          ])
        }
      } catch (e) {
      } finally {
        setLoading(false)
      }
    },
    [teamInfo?.id, triggerGetWooUsageInfo],
  )

  useEffect(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(1)
    handleDateChange(date.toDateString())
  }, [handleDateChange])
  return (
    <UsageContext.Provider
      value={{
        allNum,
        usageData,
        percentNum,
        dataNums,
        loading,
        handleDateChange,
      }}
    >
      {props.children}
    </UsageContext.Provider>
  )
}
