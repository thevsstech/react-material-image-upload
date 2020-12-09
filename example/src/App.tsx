import React, { useRef } from 'react'

import '@thevsstech/react-material-image-uploader/dist/index.css'
import { Button } from '@material-ui/core'
import {SingleUploaderModal, SingleUploaderRef} from '@thevsstech/react-material-image-uploader'
import { createMuiTheme }  from '@material-ui/core/styles'
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
        defaultImage: '',
        onSave: (save  ?: string) => console.log(save),
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
