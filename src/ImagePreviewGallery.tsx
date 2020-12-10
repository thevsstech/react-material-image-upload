import { ImageType } from './ImageUploader'
import React, { useCallback, useImperativeHandle, useState } from 'react'
import { Modal } from './Modal'
import { ThemeProvider } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import styles from './styles.module.css'
import IconButton from '@material-ui/core/IconButton'
import {
  Close,
  CloudDownload,
  NavigateBefore,
  NavigateNext
} from '@material-ui/icons'
import Typography from '@material-ui/core/Typography'
import { downloadImage } from './download'
import withStyles from '@material-ui/core/styles/withStyles'
type State = {
  images: ImageType[]
  index: number
  visible: boolean
}

type ShowDataType = Omit<State, 'visible'>

export type ImagePreviewGalleryRef = {
  show: (data: ShowDataType) => void
  close: () => void
}

type ImagePreviewGalleryProps = {
  theme: Theme
}

const inline = {
  button: {
    color: '#eee'
  },

  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

const IconButtonStyled = withStyles({
  root: {
    color: '#eee'
  },

  disabled: {
    color: '#bfbfbf'
  }
})(IconButton)

export const ImagePreviewGallery = React.forwardRef<
  ImagePreviewGalleryRef,
  ImagePreviewGalleryProps
>((props, ref) => {
  const { theme } = props
  const [state, setState] = useState<State>({
    images: [],
    index: 0,
    visible: false
  })

  const handleShow = (state: ShowDataType) => {
    setState({
      ...state,
      visible: true
    })
  }

  const handleClose = () => {
    setState({
      visible: false,
      index: 0,
      images: []
    })
  }

  useImperativeHandle(
    ref,
    () => ({
      show: handleShow,
      close: handleClose
    }),
    []
  )

  const nextIndex = state.index + 1
  const canGoNext = typeof state.images[nextIndex] !== 'undefined'
  const canGoPrev = state.index > 0

  const goPrev = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      index: prevState.index - 1
    }))
  }, [])

  const goNext = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      index: prevState.index + 1
    }))
  }, [])

  const img =
    typeof state.images[state.index] !== 'undefined'
      ? state.images[state.index].url
      : null

  const download = async () => {
    const selected = state.images[state.index]
    if (selected && selected.url && selected.name) {
      await downloadImage(selected.url, selected.name)
    }
  }

  return state.visible && img ? (
    <Modal open translucent minHeight='100%' maxWidth='xl'>
      <ThemeProvider theme={theme}>
        <div style={inline.container}>
          <img src={img} />
        </div>

        <div className={styles.galleryButtonContainer}>
          <IconButtonStyled onClick={goPrev} disabled={!canGoPrev}>
            <NavigateBefore />
          </IconButtonStyled>

          <IconButtonStyled onClick={goNext} disabled={!canGoNext}>
            <NavigateNext />
          </IconButtonStyled>
        </div>

        <div className={styles.galleryTop}>
          <Typography style={inline.button} variant='h6'>
            {state.index + 1} / {state.images.length}
          </Typography>

          <div className={styles.galleryButtons}>
            <IconButton onClick={download} style={inline.button}>
              <CloudDownload />
            </IconButton>

            <IconButton style={inline.button} onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </div>
      </ThemeProvider>
    </Modal>
  ) : null
})
