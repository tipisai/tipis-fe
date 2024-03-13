import axios from "axios"

export const uploadAvatar = (url: string, file: Blob) => {
  const resUrl = url.split("?")[0]

  return new Promise<string>(async (resolve, reject) => {
    try {
      await axios.put(url, file, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-amz-acl": "public-read",
        },
      })
      resolve(resUrl)
    } catch (e) {
      reject(e)
    }
  })
}
