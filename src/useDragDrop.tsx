import React, { useState } from 'react'

type Props = (files: FileList) => void

export default function useDragDrop<T extends HTMLElement>(handleDrop: Props) {
  const prevent = (e: React.DragEvent<T>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const [dragging, setDragging] = useState(false)
  const [overArea, setOverArea] = useState(false)

  const onDragStart = (e: React.DragEvent<T>) => {
    prevent(e)

    setDragging(true)
  }

  const onDragEnd = (e: React.DragEvent<T>) => {
    prevent(e)

    setDragging(false)
  }

  const onDragEnter = (e: React.DragEvent<T>) => {
    prevent(e)

    setOverArea(true)
  }

  const onDragOver = (e: React.DragEvent<T>) => {
    prevent(e)
    setOverArea(true)
  }

  const onDragLeave = (e: React.DragEvent<T>) => {
    prevent(e)

    setOverArea(false)
  }

  const onDrop = (e: React.DragEvent<T>) => {
    prevent(e)

    if (e.dataTransfer.files && e.dataTransfer.files.length && handleDrop) {
      handleDrop(e.dataTransfer.files)
    }
  }

  return {
    handlers: {
      onDragEnd,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDragStart,
      onDrop
    },

    dragging,
    overArea
  }
}
