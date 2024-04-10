import { FC, createContext, useRef } from "react"
import { UploadFileStore } from "@/utils/drive"
import {
  IUploadContextInjectProps,
  IUploadContextProviderProps,
} from "./interface"

export const UploadContext = createContext({} as IUploadContextInjectProps)

export const UploadContextProvider: FC<IUploadContextProviderProps> = (
  props,
) => {
  const uploadFileStore = useRef(new UploadFileStore())
  return (
    <UploadContext.Provider
      value={{
        uploadFileStore: uploadFileStore.current,
      }}
    >
      {props.children}
    </UploadContext.Provider>
  )
}
