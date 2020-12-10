import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { Modal } from './Modal'

import ImageUploader, {
  ImageType,
  ImageUploaderProps,
  ImageUploaderRef
} from './ImageUploader'
import Button from '@material-ui/core/Button'
import { ThemeProvider } from '@material-ui/core'
import styles from './styles.module.css'
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
  defaultImage?: ImageType
  onSave: (image: ImageType) => void
  onCancel?: () => void
}
type ShowParameters = Omit<State, 'visible'>

const SingleUploaderModal = React.forwardRef<SingleUploaderRef, Props>(
  (props, forwardRef) => {
    const {
      dragText,
      theme,
      selectImageText,

      saveText,
      cancelText,
      accept
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
      state.onSave(ref.current ? ref.current.getImageUrl() : {})
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
                {...{ dragText, selectImageText, accept }}
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
