import React, { useRef } from 'react'

import '@thevsstech/react-material-image-uploader/dist/index.css'
import { Button } from '@material-ui/core'
import {SingleUploaderModal, SingleUploaderRef, ImagePreviewGallery} from '@thevsstech/react-material-image-uploader'
import { createMuiTheme }  from '@material-ui/core/styles'
import { ImageType } from '../../src/ImageUploader'
import { ImagePreviewGalleryRef } from '../../src'
const theme = createMuiTheme({
  palette: {
    primary: { 500: '#467fcf' },
  },
})
const App = () => {
  const uploaderRef = useRef<SingleUploaderRef>(null)
  const galleryRef = useRef<ImagePreviewGalleryRef>(null)
  const show = () => {
    if (uploaderRef.current) {
      uploaderRef.current.show({
        defaultImage: {
          url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyApbo-ma8sTWNbKrodLm96Q89u_N2sXX49A&usqp=CAU',
          name: 'gmail.png'
        },
        onSave: (image: ImageType) => console.log(image),
        onCancel: () => console.log('cancel')
      })
    }
  }

  const showGalleries = () => {
    if (galleryRef.current) {
      galleryRef.current.show({
        index: 0,
        images: [
          {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyApbo-ma8sTWNbKrodLm96Q89u_N2sXX49A&usqp=CAU',
            name: 'gmail.png'
          },
          {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyApbo-ma8sTWNbKrodLm96Q89u_N2sXX49A&usqp=CAU',
            name: 'gmail.png'
          }
        ]
      })
    }
  }
  return  <div>


<SingleUploaderModal
  theme={theme}
  dragText={'drop files here'}
  saveText={'save'}
  title={'Upload image'}
  cancelText={'cancel'}


  ref={uploaderRef}/>

  <ImagePreviewGallery ref={galleryRef} theme={theme} />
    <Button onClick={show}>
      Show
    </Button>

    <Button onClick={showGalleries}>
      Show Gallery
    </Button>
  </div>
}

export default App
