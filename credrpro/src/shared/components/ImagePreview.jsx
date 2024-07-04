import React from 'react'
import { CloseIcon } from '../../core/utility/iconHelper'
import classname from 'classnames'

const ImagePreview = ({ url, onRemove, onImageClick, className }) => (
  <div className={classname("preview-container", className)}>
    <img className="preview" src={url} alt="Preview" onClick={onImageClick} />
    <div className="close-btn--round">
      <img className="close-icon" src={CloseIcon} onClick={onRemove} alt="X" />
    </div>
  </div>
)

export default ImagePreview