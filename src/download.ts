export function toDataURL(url: string): Promise<string> {
  return fetch(url)
    .then((response) => {
      return response.blob()
    })
    .then((blob) => {
      return URL.createObjectURL(blob)
    })
}

export const downloadImage = async (url: string, name: string) => {
  const a = document.createElement('a')
  a.href = await toDataURL(url)
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
