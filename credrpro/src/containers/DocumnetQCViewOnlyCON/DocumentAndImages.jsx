import React, { Fragment, useState } from 'react'
import Viewer from 'react-viewer'

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
      <h1 className="tab-heading">Vehicle Images</h1>
      <div className="doc-container">
        {/* <p className="doc-name">Vehicle Images</p> */}
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
      
      <Viewer
          visible={isImageOpen}
          images={images}
          activeIndex={currentIndex}
          onClose={closeImageViewer}
        />
    </Fragment>
  )
}

export default DocumentAndImages