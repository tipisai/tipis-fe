import { base642Blob } from "."

export const fetchUploadBase64 = async (url: string, base64: string) => {
  const resUrl = url.split("?")[0]
  const file = await base642Blob(base64)
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
      "x-amz-acl": "public-read",
    },
    body: file,
  })
  return resUrl
}
