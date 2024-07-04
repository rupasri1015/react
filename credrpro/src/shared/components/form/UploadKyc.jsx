import React, { createRef } from 'react'
import Backup from '@material-ui/icons/Backup'

const Upload = ({ onFileChange, multiple, accept, name, disabled, onNotSupported, id }) => {
  const uploadRef = createRef()

  const onFileSelection = event => {
    if (onFileChange) {
      if (accept) {
        const validFiles = Object.values(event.target.files).filter(file => file.type.includes(accept.split('/')[0]))
        if (validFiles.length){
          onFileChange(validFiles)
        }
        else{
          onNotSupported()
        }
      } else {
        onFileChange(Object.values(event.target.files))
      }
    }
  }

  return (
    <div style={{ display: 'inline-block', minWidth: 115 }}>
      <button className="icon-btn small " disabled={disabled} type="button" onClick={() => uploadRef.current.click()}>{name || 'Upload'} <Backup style={{ fontSize: 17 }} /></button>
      <input
        onChange={onFileSelection}
        onClick={event => event.target.value = null}
        type="file"
        style={{ display: 'none' }}
        ref={uploadRef}
        accept={accept}
        multiple={multiple}
        id={id}
      />
    </div>
  )
}

export default Upload