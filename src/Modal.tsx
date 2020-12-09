import makeStyles from '@material-ui/core/styles/makeStyles'
import React, { useState } from 'react'
import { ModalProps } from '@material-ui/core/Modal'
import MaterialModal from '@material-ui/core/Modal/Modal'
import Container from '@material-ui/core/Container'

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

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    minHeight: 300
  }
}))

export function Modal({ children, ...rest }: ModalProps) {
  const classes = useStyles()
  const [styles] = useState(getModalStyle())
  return (
    <MaterialModal {...rest}>
      <Container maxWidth='sm' style={styles} className={classes.paper}>
        {children}
      </Container>
    </MaterialModal>
  )
}
