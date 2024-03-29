import axios from "axios"
import { UPLOAD_FILE_STATUS } from "@illa-public/public-types"

export const updateFilesToDrive = async (
  url: string,
  uploadFile: File,
  processCall?: (loaded: number) => void,
  abortSignal?: AbortSignal,
) => {
  try {
    const openUploadLink = await axios.post(url, null, {
      headers: {
        "x-goog-resumable": "start",
        "Content-Type": uploadFile.type,
      },
      withCredentials: false,
      signal: abortSignal,
    })
    if (openUploadLink.headers.location) {
      await axios.put(openUploadLink.headers.location, uploadFile, {
        headers: {
          "Content-Type": uploadFile.type,
        },
        withCredentials: false,
        signal: abortSignal,
        onUploadProgress: (progressEvent) => {
          if (processCall) processCall(progressEvent.loaded)
        },
      })
      return Promise.resolve(UPLOAD_FILE_STATUS.COMPLETE)
    }
    return Promise.resolve(UPLOAD_FILE_STATUS.FAILED)
  } catch (e) {
    return Promise.resolve(UPLOAD_FILE_STATUS.FAILED)
  }
}
