import axios from "axios"
import { UPLOAD_FILE_STATUS } from "@illa-public/public-types"

export const uploadFileToObjectStorage = async (
  url: string,
  uploadFile: File,
  abortSignal?: AbortSignal,
) => {
  try {
    await axios.put(url, uploadFile, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-amz-acl": "public-read",
      },
      signal: abortSignal,
    })
    return Promise.resolve(UPLOAD_FILE_STATUS.COMPLETE)
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ERR_CANCELED"
    ) {
      return Promise.resolve(UPLOAD_FILE_STATUS.CANCELED)
    }
    return Promise.resolve(UPLOAD_FILE_STATUS.FAILED)
  }
}
