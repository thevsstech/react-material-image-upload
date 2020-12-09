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
const useStyles = makeStyles({
  container: {
    width: 320,
    height: 320,
    border: '2px dotted  #ccc',
    borderRadius: 5
  }
})

export type ImageUploaderProps = {
  selectImageText?: string | JSX.Element
  defaultImage?: string
  previewText: string
  cropperStyle?: React.CSSProperties
}

export type ImageUploaderRef = {
  getImageUrl: () => string
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
    const [image, setImage] = useState<string | undefined>(defaultImage)
    const inputRef = useRef<HTMLInputElement>(null)
    const previewRef = useRef<HTMLImageElement>(null)
    const [url, setUrl] = useState<string>()
    useImperativeHandle(
      ref,
      () => ({
        // @ts-ignore
        getImageUrl: () => url
      }),
      [url]
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
              setImage(e.target.result as string)
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
      return image ? (
        <ImageCropper src={image} style={cropperStyle} onCrop={onCrop} />
      ) : null
    }, [image, onCrop, cropperStyle])

    return (
      <div>
        <form>
          <Grid container spacing={2} direction='row'>
            {image ? (
              <div>
                {cropper}

                <div className={styles.closeButton}>
                  <IconButton onClick={reset}>
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
      </div>
    )
  }
)
