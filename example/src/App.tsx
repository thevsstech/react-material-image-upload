import React, { useRef } from 'react'

import '@thevsstech/react-material-image-uploader/dist/index.css'
import { Button } from '@material-ui/core'
import {SingleUploaderRef , SingleUploaderModal} from '@thevsstech/react-material-image-uploader'

const App = () => {
  const uploaderRef = useRef<SingleUploaderRef>(null)
  const show = () => {
    if (uploaderRef.current) {
     uploaderRef.current.show()
    }
  }
  return  <div>


<SingleUploaderModal
  previewText={'preview'}
  saveText={'save'}
  title={'Upload image'}
  cancelText={'cancel'}
  defaultImage={'https://d33wubrfki0l68.cloudfront.net/446b1f54b7535dc5e58648c68222312c90c1aec6/14bd8/img/profile.jpg'}
  onSave={(image) => console.log(image)}

  ref={uploaderRef}/>
    <Button onClick={show}>
      Show
    </Button>
  </div>
}

export default App
