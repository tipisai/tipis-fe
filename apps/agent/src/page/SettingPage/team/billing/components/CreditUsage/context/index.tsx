import dayjs from "dayjs"
import { FC, createContext, useCallback, useEffect, useState } from "react"
import { useLazyGetCreditUsageInfoQuery } from "@illa-public/user-data"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { DATE_FORMAT, LABEL_CONFIG } from "../constants"
import { UsageContextProps, UsageContextProviderProps } from "./interface"

export const UsageContext = createContext<UsageContextProps>(
  {} as UsageContextProps,
)

export const UsageProvider: FC<UsageContextProviderProps> = (props) => {
  const teamInfo = useGetCurrentTeamInfo()!
  // const [dataNums, setsDataNums] = useState<number[]>([0, 0, 0])
  const [dataNums, setsDataNums] = useState<number[]>([0])
  const [allNum, setAllNum] = useState<number>(0)
  // const [percentNum, setPercentNum] = useState<number[]>([0, 0, 0])
  const [percentNum, setPercentNum] = useState<number[]>([0])
  const [loading, setLoading] = useState(false)

  const [triggerGetCreditUsageInfo] = useLazyGetCreditUsageInfoQuery()

  const usageData = {
    labels: LABEL_CONFIG.NAME.map((item) => item),
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
        const res = await triggerGetCreditUsageInfo({
          teamID: teamInfo?.id,
          fromDate: dayjs(fromDate).format(DATE_FORMAT),
          toDate: dayjs(endDate).format(DATE_FORMAT),
        }).unwrap()
        if (res) {
          const {
            aiTokenGeneralUsage = 0,
            // driveVolumeUsage = 0,
            // driveTrafficUsage = 0,
            totalCreditUsage = 0,
            aiTokenGeneralUsagePercent = 0,
            // driveVolumeUsagePercent = 0,
            // driveTrafficUsagePercent = 0,
          } = res
          setsDataNums([
            aiTokenGeneralUsage,
            // driveVolumeUsage,
            // driveTrafficUsage,
          ])
          setAllNum(totalCreditUsage)
          setPercentNum([
            aiTokenGeneralUsagePercent,
            // driveVolumeUsagePercent,
            // driveTrafficUsagePercent,
          ])
        }
      } catch (e) {
      } finally {
        setLoading(false)
      }
    },
    [teamInfo?.id, triggerGetCreditUsageInfo],
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
