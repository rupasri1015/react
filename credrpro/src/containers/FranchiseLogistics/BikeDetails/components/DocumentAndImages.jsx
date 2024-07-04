import React, { Fragment, useState } from 'react'
import ImageViewer from 'react-images-viewer'

const getParams = (params, value, key) => {
  if (params) {
    const dataParams = params.filter(param => param.title === value)
    if (dataParams.length) {
      return dataParams[0][key]
    }
    return []
  }
  return []
}

const DocumentAndImages = ({ userDocs, vehicleDocs, kycDocs, deliveryNotes }) => {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState([])
  const [isImageOpen, setImageOpen] = useState(false)

  const openImageViewer = (imagesData, index, key, caption) => {
    if (Array.isArray(imagesData)) {
      const imgs = imagesData.map(image => ({ src: image[key], caption: image[caption] }))
      setImages(imgs)
    } else {
      setImages(
        [{ src: imagesData, caption }])
    }
    setCurrentIndex(index)
    setImageOpen(true)
  }

  const closeImageViewer = () => {
    setImageOpen(false)
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
    <Fragment>
      <h1 className="tab-heading">Document And Images</h1>
      <div className="doc-container">
        <p className="doc-name">User Documents</p>
        <div className="docs">
          {
            userDocs.userProofImage ?
              <div className="doc-preview" onClick={() => openImageViewer(userDocs.userProofImage, 0, null, userDocs.userProofType)}>
                <img src={userDocs.userProofImage} alt="User Doc" />
              </div> :
              "NA"
          }
        </div>
      </div>
      <div className="doc-container">
        <p className="doc-name">Vehicle Documents</p>
        <div className="docs">
          {
            userDocs.bikeRcImage ?
              <div className="doc-preview" onClick={() => openImageViewer(userDocs.bikeRcImage, 0, null, "RC")}>
                <img src={userDocs.bikeRcImage} alt="Vehicl Doc" />
              </div> :
              "NA"
          }
        </div>
      </div>
      <div className="doc-container">
        <p className="doc-name">Vehicle Images</p>
        <div className="docs">
          {
            getParams(vehicleDocs, 'ADD PHOTOS', 'inspectionDetails').length ?
              getParams(vehicleDocs, 'ADD PHOTOS', 'inspectionDetails').map((vehicle, index) => (
                <div className="doc-preview" key={vehicle.leadParameterValue} onClick={() => openImageViewer(getParams(vehicleDocs, 'ADD PHOTOS', 'inspectionDetails'), index, 'leadParameterValue', 'leadParameterName')}>
                  <img src={vehicle.leadParameterValue} alt={vehicle.leadParameterName} />
                </div>
              )) :
              'NA'
          }
        </div>
      </div>
      <div className="doc-container">
        <p className="doc-name">KYC</p>
        <div className="docs">
          {
            kycDocs.length ?
              <div className="doc-preview" onClick={() => openImageViewer(kycDocs[0].userCancelCheque, 0, null, kycDocs[0].accountHolderName)}>
                <img src={kycDocs[0].userCancelCheque} alt="Cancel Cheque" />
              </div> :
              'NA'
          }
        </div>
      </div>
      <div className="doc-container">
        <p className="doc-name">Delivery Note</p>
        <div className="docs">
          {
            deliveryNotes.length ?
              deliveryNotes.map((note, index) => (
                <div className="doc-preview" key={note.documentType} onClick={() => openImageViewer(deliveryNotes, index, 'documentValue', "documentType")}>
                  <img src={note.documentValue} alt={note.documentValue} />
                </div>
              )) :
              'NA'
          }
        </div>
      </div>
      <div className="doc-container">
        <p className="doc-name">Video</p>
        <div className="docs">
          {
            getParams(vehicleDocs, 'ADD VIDEO', 'inspectionDetails').length ?
              getParams(vehicleDocs, 'ADD VIDEO', 'inspectionDetails').map(vehicle => (
                String(vehicle.leadParameterValue) === "0" ? 'No Video Attached' :
                  (<video
                    src={vehicle.leadParameterValue}
                    key={vehicle.leadParameterValue}
                    height="240"
                    controls
                  >
                    <p>Video Not Supported</p>
                  </video>)
              )) :
              'NA'
          }
        </div>
      </div>
      <ImageViewer
        isOpen={isImageOpen}
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
    </Fragment>
  )
}

export default DocumentAndImages