import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { renderString } from '../../../core/utility'
import ImageViewer from 'react-images-viewer'

const ViewReason = ({ leadData, isOpen, onClose }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const setImagesforView = () => {
    setImages(leadData.referenceImages.map(img => ({ src: img })))
    setIsViewerOpen(true)
  }

  const closeImageViewer = () => {
    setIsViewerOpen(false)
    setImages([])
    setCurrentIndex(0)
  }

  const nextImage = () => {
    setCurrentIndex(currentIndex + 1)
  }

  const previousImage = () => {
    setCurrentIndex(currentIndex - 1)
  }

  const imageClick = () => {
    if (currentIndex === images.length - 1) return
    nextImage()
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reason for Reject <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
        </DialogTitle>
        <DialogContent>
          <div className="reason-block">
            <p className="reason-title">Reason:</p>
            <p className="reason-data">{renderString(leadData.reasonForRejected)}</p>
          </div>
          <div className="reason-block">
            <p className="reason-title">Remarks:</p>
            <p className="reason-data">{renderString(leadData.remarks)}</p>
          </div>
          <p className="referece-images">Reference Images:</p>
          <div className="referecne-image-wrapper">
            {
              Boolean(leadData.referenceImages && leadData.referenceImages.length) ?
                leadData.referenceImages.map((img, index) => <img src={img} key={`${img}${index}`} alt={`Reference Document ${index + 1}`} onClick={setImagesforView} />) : 'NA'
            }
          </div>
        </DialogContent>
        <DialogActions>
          <button className="icon-btn" type="button" onClick={onClose}>Close</button>
        </DialogActions>
      </Dialog >
      <ImageViewer
        isOpen={isViewerOpen}
        imgs={images}
        currImg={currentIndex}
        onClose={closeImageViewer}
        onClickNext={nextImage}
        onClickPrev={previousImage}
        onClickImg={imageClick}
        closeBtnTitle='Close'
        rightArrowTitle="Next"
        leftArrowTitle="Previous"
        backdropCloseable
      />
    </>
  )
}

export default ViewReason