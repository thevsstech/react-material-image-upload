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
import useDragDrop from './useDragDrop'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { checkMimeTypes, readFile, readFileAsync } from './check'

const useStyles = makeStyles<Theme, { active: boolean }>((theme) => ({
  container: (props) => ({
    width: '100%',
    height: 320,
    border: props.active ? '2px dotted #fff' : '2px dotted  #ccc',
    borderRadius: 5
  }),
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
  dragText?: string
  cropperStyle?: React.CSSProperties
  accept?: string[]
  onMultipleImagesGiven?: (images: ImageType[]) => void
}

export type ImageUploaderRef = {
  getImageUrl: () => ImageType
}

export default React.forwardRef<ImageUploaderRef, ImageUploaderProps>(
  (
    {
      selectImageText = 'Select Image',
      dragText = 'Drop Files Here',
      cropperStyle,
      defaultImage,
      onMultipleImagesGiven,
      accept = ['image/png', 'image/jpeg', 'image/jpg']
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

    const onCrop = useCallback(
      (image: string) => {
        setUrl(image)
      },
      [previewRef]
    )

    // reads multipleFiles and calls onMultipleImagesGiven callback
    const readMultipleFiles = (files: File[]) => {
      if (onMultipleImagesGiven) {
        const promises: PromiseLike<ImageType>[] = Array.from(
          files
        ).map((file: File) => readFileAsync(file))

        Promise.all<ImageType>(promises).then((files) => {
          onMultipleImagesGiven(files)
        })
      }
    }

    const uploadImage = useCallback(({ target: { files } }) => {
      if (files && files.length) {
        if (files.length > 1 && onMultipleImagesGiven) {
          readMultipleFiles(files)
        } else {
          readFile(files[0], setImage)
        }
      }
    }, [])

    // this methods handles drag and drop images
    // supports both multiple and single drag & drop
    const handleDrop = useCallback(
      (files: FileList) => {
        if (files.length === 1) {
          if (checkMimeTypes(files[0], accept)) {
            readFile(files[0], setImage)
          }
        } else {
          const newFiles = Array.from<File>(files).filter((file) =>
            checkMimeTypes(file, accept)
          )

          readMultipleFiles(newFiles)
        }
      },
      [accept]
    )
    const { handlers, dragging, overArea } = useDragDrop(handleDrop)
    const active = useMemo(
      () => ({
        active: dragging || overArea
      }),
      [dragging, overArea]
    )
    const classes = useStyles(active)

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
              {...handlers}
              alignItems='center'
              className={classes.container}
              justify='center'
              onClick={() =>
                inputRef.current ? inputRef.current.click() : null
              }
            >
              <Typography variant='h5'>
                {active.active ? dragText : selectImageText}
              </Typography>
              <input
                name='files'
                onChange={uploadImage}
                type='file'
                hidden
                multiple={!!onMultipleImagesGiven}
                accept={accept ? accept.join(',') : undefined}
                ref={inputRef}
              />
            </Grid>
          )}
        </Grid>
      </form>
    )
  }
)
