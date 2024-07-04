import React, { createRef, Fragment } from 'react'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'

const Upload = ({ onFileChange, multiple, accept, error, label, value }) => {
  const uploadRef = createRef()

  const onFileSelection = event => {
    if (onFileChange) {
      if (accept) {
        const validFiles = Object.values(event.target.files).filter(file => file.type.includes(accept.split('/')[0]))
        if (validFiles.length)
          onFileChange(validFiles)
      } else {
        const files = Object.values(event.target.files)
        onFileChange(files)
      }
    }
  }

  return (
    <Fragment>
      <FormControl className='w-100'>
        <div className="input-upload-container" onClick={() => uploadRef.current.click()}>
          <TextField
            placeholder={value || label}
            error={Boolean(error)}
            InputProps={{
              readOnly: true
            }}
          />
          <button type="button">Upload</button>
        </div>
        <FormHelperText style={{ color: '#c00' }}>{error}</FormHelperText>
      </FormControl>
      <input
        onChange={onFileSelection}
        onClick={event => event.target.value = null}
        type="file"
        style={{ display: 'none' }}
        ref={uploadRef}
        accept={accept}
        multiple={multiple}
      />
    </Fragment>
  )
}

export default Upload