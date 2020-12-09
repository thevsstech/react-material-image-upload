import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import 'cropperjs/dist/cropper.css'
import Cropper from 'react-cropper'
import { IconButton } from '@material-ui/core'
import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import styles from './styles.module.css'

type Props = {
  src: string
  onCrop?: (croppedImage: string) => void
  style?: React.CSSProperties
}

const defaultStyles = {
  container: {
    width: '100%',
    height: 320
  }
}

const ImageCropper = ({ src, style = {}, onCrop }: Props) => {
  const cropperRef = useRef<HTMLImageElement & { cropper: Cropper }>(null)
  const [zoom, setZoom] = useState<number>(1)
  const onCropCallback = useCallback(() => {
    const imageElement: any = cropperRef?.current
    const cropper: any = imageElement?.cropper

    const uri = cropper.getCroppedCanvas().toDataURL()
    if (onCrop) {
      onCrop(uri)
    }
  }, [cropperRef, onCrop])

  const cropperStyles = useMemo<React.CSSProperties>(
    () => ({
      ...style,
      ...defaultStyles.container
    }),
    [style, defaultStyles.container]
  )

  useEffect(() => {
    if (cropperRef.current) {
      // @ts-ignore
      cropperRef.current.addEventListener(
        'zoom',
        (event: { detail: { ratio: number } }) => {
          if (event?.detail.ratio) {
            setZoom(event.detail.ratio)
          }
        }
      )
    }
  }, [cropperRef])

  const zoomTo = useCallback(
    (type: 'up' | 'down') => {
      if (cropperRef.current) {
        const nextZoom = type === 'up' ? zoom + 0.1 : zoom - 0.1
        cropperRef.current.cropper.zoomTo(nextZoom)
      }
    },
    [cropperRef.current, zoom]
  )
  return (
    <div style={cropperStyles}>
      <Cropper
        src={src}
        style={cropperStyles}
        // Cropper.js options
        initialAspectRatio={1}
        guides
        zoomable
        zoomOnTouch
        zoomOnWheel
        crop={onCropCallback}
        ref={cropperRef}
      />

      <div className={styles.buttonContainer}>
        <IconButton onClick={() => zoomTo('up')}>
          <ZoomIn />
        </IconButton>

        <IconButton onClick={() => zoomTo('down')}>
          <ZoomOut />
        </IconButton>
      </div>
    </div>
  )
}

export default ImageCropper
