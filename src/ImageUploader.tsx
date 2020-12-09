import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import ImageCropper from './ImageCropper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import styles from './styles.module.css'
const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: 320,
    border: '2px dotted  #ccc',
    borderRadius: 5
  },
  button: {
    backgroundColor: theme.palette.background.paper
  }
}))

export type ImageType = {
  url?: string
  name?: string
}

export type ImageUploaderProps = {
  selectImageText?: string | JSX.Element
  defaultImage?: ImageType
  previewText: string
  cropperStyle?: React.CSSProperties
}

export type ImageUploaderRef = {
  getImageUrl: () => ImageType
}

export default React.forwardRef<ImageUploaderRef, ImageUploaderProps>(
  (
    {
      selectImageText = 'Select Image',
      previewText = 'Preview',
      cropperStyle,
      defaultImage
    },
    ref
  ) => {
    const [image, setImage] = useState<ImageType | undefined>(defaultImage)
    const inputRef = useRef<HTMLInputElement>(null)
    const previewRef = useRef<HTMLImageElement>(null)
    const [url, setUrl] = useState<string>()
    useImperativeHandle(
      ref,
      () => ({
        // @ts-ignore
        getImageUrl: () => ({
          name: image?.name,
          url
        })
      }),
      [image?.name, url]
    )

    const classes = useStyles()

    const onCrop = useCallback(
      (image: string) => {
        setUrl(image)
      },
      [previewRef]
    )

    const uploadImage = useCallback(({ target: { files } }) => {
      if (files && files.length) {
        if (files.length > 1) {
        } else {
          var reader = new FileReader()

          reader.onload = function (e: ProgressEvent<FileReader>) {
            if (e && e.target?.result) {
              setImage({
                url: e.target.result as string,
                name: files[0].name
              })
            }
          }

          reader.readAsDataURL(files[0])
        }
      }
    }, [])

    const reset = () => {
      setImage(undefined)
      setUrl(undefined)
    }

    const cropper = useMemo(() => {
      return image?.url ? (
        <ImageCropper src={image?.url} style={cropperStyle} onCrop={onCrop} />
      ) : null
    }, [image?.url, onCrop, cropperStyle])

    return (
      <form className={styles.uploaderContainer}>
        <Grid container spacing={2} direction='row'>
          {image ? (
            <div className={styles.uploaderContainer}>
              {cropper}

              <div className={styles.closeButton}>
                <IconButton className={classes.button} onClick={reset}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          ) : (
            <Grid
              container
              alignItems='center'
              className={classes.container}
              justify='center'
              onClick={() =>
                inputRef.current ? inputRef.current.click() : null
              }
            >
              <Typography variant='h4'>{selectImageText}</Typography>
              <input
                name='files'
                onChange={uploadImage}
                type='file'
                hidden
                ref={inputRef}
              />
            </Grid>
          )}
        </Grid>
      </form>
    )
  }
)
