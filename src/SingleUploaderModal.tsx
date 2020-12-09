import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import Modal from '@material-ui/core/Modal/Modal'

import ImageUploader, {
  ImageUploaderProps,
  ImageUploaderRef
} from './ImageUploader'
import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography/Typography'
import { Toolbar } from '@material-ui/core'
import styles from './styles.module.css'
import AppBar from '@material-ui/core/AppBar'
type Props = Exclude<ImageUploaderProps, 'defaultImage'> & {
  saveText: string
  cancelText: string
  title: string
}

export type SingleUploaderRef = {
  show: (state: ShowParameters) => void
  hide: () => void
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5, 5, 5, 5),
    width: 340,
    height: 340
  }
}))

type State = {
  visible: boolean
  defaultImage?: string
  onSave: (image?: string) => void
  onCancel?: () => void
}

type ShowParameters = Exclude<SingleUploaderRef, 'visible'>

const SingleUploaderModal = React.forwardRef<SingleUploaderRef, Props>(
  (
    { saveText, cancelText, selectImageText, previewText, title },
    forwardRef
  ) => {
    const classes = useStyles()
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

    return !state.visible ? (
      <Modal
        open
        className={classes.paper}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        <div>
          <AppBar position='static'>
            <Toolbar className='flex w-full'>
              <Typography variant='subtitle1' color='inherit'>
                {title}
              </Typography>
            </Toolbar>
          </AppBar>

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
      </Modal>
    ) : null
  }
)

export { SingleUploaderModal }
