import makeStyles from '@material-ui/core/styles/makeStyles'
import React, { useState } from 'react'
import { ModalProps } from '@material-ui/core/Modal'
import MaterialModal from '@material-ui/core/Modal/Modal'
import Container, {
  ContainerProps,
  ContainerTypeMap
} from '@material-ui/core/Container'
import { Theme } from '@material-ui/core'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    padding: 0
  }
}

type Props = ModalProps & {
  maxWidth?: ContainerTypeMap<ContainerProps>['props']['maxWidth']
  translucent?: boolean
  minHeight?: number | string
}

const useStyles = makeStyles<
  Theme,
  { translucent?: boolean; minHeight?: number | string }
>((theme) => ({
  paper: (props) => ({
    position: 'absolute',
    backgroundColor: props.translucent
      ? 'transparent'
      : theme.palette.background.paper,
    boxShadow: props.translucent ? undefined : theme.shadows[5],
    minHeight: props.minHeight || 300,
    outline: props.translucent ? 'none' : '1px solid #ccc',
    display: 'flex',
    flexDirection: 'column'
  })
}))

export function Modal({
  children,
  translucent,
  minHeight = 300,
  maxWidth = 'sm',
  ...rest
}: Props) {
  const classes = useStyles({ translucent, minHeight })
  const [styles] = useState(getModalStyle())
  return (
    <MaterialModal {...rest}>
      <Container maxWidth={maxWidth} style={styles} className={classes.paper}>
        {children}
      </Container>
    </MaterialModal>
  )
}
