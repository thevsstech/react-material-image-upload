import { ImageType } from './ImageUploader'

export const checkMimeTypes = (file: File, accepts: string[]) => {
  return accepts.find((meme) => meme === file.type)
}

export const readFile = (
  file: File,
  callBackWithImage: (image: ImageType) => void
) => {
  const reader = new FileReader()

  reader.onload = function (e: ProgressEvent<FileReader>) {
    if (e && e.target?.result) {
      callBackWithImage({
        url: e.target.result as string,
        name: file.name
      })
    }
  }

  reader.readAsDataURL(file)
}

export function readFileAsync(file: File): Promise<ImageType> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e && e.target?.result) {
        resolve({
          url: e.target.result as string,
          name: file.name
        })
      }
    }

    reader.onerror = reject

    reader.readAsDataURL(file)
  })
}
