import { Zip, ZipPassThrough } from "fflate"
import { createWriteStream } from "streamsaver"

export const handleDownloadFiles = async (
  downloadInfo: { name: string; downloadURL: string }[],
  asZip?: boolean,
) => {
  if (!Array.isArray(downloadInfo) || downloadInfo.length === 0) {
    return Promise.reject()
  }
  let promise = Promise.resolve()
  const zip = new Zip()
  const zipName = `tipis_download_${new Date().getTime()}.zip`
  const zipReadableStream = new ReadableStream({
    start(controller) {
      zip.ondata = (error, data, final) => {
        if (error) {
          controller.error(error)
        } else {
          controller.enqueue(data)
          if (final) {
            controller.close()
          }
        }
      }
    },
  })
  if (asZip) {
    const streamsaver = createWriteStream(zipName)
    zipReadableStream.pipeTo(streamsaver)
  }

  for (let i = 0; i < downloadInfo.length; i++) {
    const { name, downloadURL } = downloadInfo[i]
    promise = promise.then(async () => {
      try {
        const fileResponse = await fetch(downloadURL, {
          method: "GET",
        })

        if (!asZip && window.WritableStream && fileResponse.body?.pipeTo) {
          const fileStream = createWriteStream(name)
          return fileResponse.body.pipeTo(fileStream)
        }
        if (asZip) {
          const zipStream = new ZipPassThrough(name)
          zip.add(zipStream)
          const fileReader = fileResponse.body?.getReader()
          while (fileReader) {
            const { value, done } = await fileReader.read()
            if (done) {
              zipStream.push(new Uint8Array(0), true)
              return Promise.resolve()
            }
            zipStream.push(value)
          }
        }
      } catch (e) {
        return Promise.reject(e)
      }
    })
  }
  if (asZip) {
    promise.then(() => {
      zip.end()
    })
  }
}
