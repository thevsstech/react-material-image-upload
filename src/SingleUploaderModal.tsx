import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { Modal } from './Modal'

import ImageUploader, {
  ImageUploaderProps,
  ImageUploaderRef
} from './ImageUploader'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography/Typography'
import { Toolbar, ThemeProvider } from '@material-ui/core'
import styles from './styles.module.css'
import AppBar from '@material-ui/core/AppBar'
type Props = Exclude<ImageUploaderProps, 'defaultImage'> & {
  saveText: string
  cancelText: string
  title: string
  theme: any
}

export interface SingleUploaderRef {
  show: (state: ShowParameters) => void
  hide: () => void
}

type State = {
  visible: boolean
  defaultImage?: string
  onSave: (image?: string) => void
  onCancel?: () => void
}
type ShowParameters = Omit<State, 'visible'>

const SingleUploaderModal = React.forwardRef<SingleUploaderRef, Props>(
  (props, forwardRef) => {
    const {
      previewText,
      theme,
      selectImageText,
      title,
      saveText,
      cancelText
    } = props

    const [state, setState] = useState<State>({
      visible: false,
      defaultImage: undefined,
      onSave: () => null,
      onCancel: () => null
    })
    const ref = useRef<ImageUploaderRef>(null)
    const handleClose = useCallback(() => {
      setState((prev) => ({
        ...prev,
        visible: false,
        defaultImage: undefined
      }))
    }, [])
    const handleSave = useCallback(() => {
      state.onSave(ref.current ? ref.current.getImageUrl() : undefined)
      handleClose()
    }, [state.onSave, ref])

    useImperativeHandle(
      forwardRef,
      () => ({
        show: (state: ShowParameters) =>
          setState((prevState) => ({
            ...prevState,
            visible: true,
            ...state
          })),
        hide: () => handleClose
      }),
      []
    )

    const handleCancel = useCallback(() => {
      if (state.onCancel) {
        state.onCancel()
      }
      handleClose()
    }, [state.onCancel])

    return state.visible ? (
      <Modal
        open
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        <ThemeProvider theme={theme}>
          <AppBar position='static'>
            <Toolbar className='flex w-full'>
              <Typography variant='subtitle1' color='inherit'>
                {title}
              </Typography>
            </Toolbar>
          </AppBar>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className={styles.modalContainer}>
              <ImageUploader
                ref={ref}
                defaultImage={state.defaultImage}
                {...{ previewText, selectImageText }}
              />
            </div>

            <div className={styles.downButtonContainer}>
              <Button onClick={handleCancel} color='primary'>
                {cancelText}
              </Button>
              <Button variant='contained' onClick={handleSave} color='primary'>
                {saveText}
              </Button>
            </div>
          </div>
        </ThemeProvider>
      </Modal>
    ) : null
  }
)

export { SingleUploaderModal }
