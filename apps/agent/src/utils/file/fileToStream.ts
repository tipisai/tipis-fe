export const fileToString = (file: File) => {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onloadend = function () {
      if (fileReader.result) {
        const res = [...new Uint8Array(fileReader.result as ArrayBuffer)]
          .map((n) => `0x${n.toString(16).toUpperCase()}`)
          .join(" ")
        resolve(res)
      }
    }
  })
}
