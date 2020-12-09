import React, { useRef } from 'react'

import '@thevsstech/react-material-image-uploader/dist/index.css'
import { Button } from '@material-ui/core'
import {SingleUploaderModal, SingleUploaderRef} from '@thevsstech/react-material-image-uploader'
import { createMuiTheme }  from '@material-ui/core/styles'
import { ImageType } from '../../src/ImageUploader'
const theme = createMuiTheme({
  palette: {
    primary: { 500: '#467fcf' },
  },
})
const App = () => {
  const uploaderRef = useRef<SingleUploaderRef>(null)
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
  return  <div>


<SingleUploaderModal
  theme={theme}
  previewText={'preview'}
  saveText={'save'}
  title={'Upload image'}
  cancelText={'cancel'}


  ref={uploaderRef}/>
    <Button onClick={show}>
      Show
    </Button>
  </div>
}

export default App
