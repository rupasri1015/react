import React, { Fragment, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ImageViewer from 'react-images-viewer'
import Upload from '../../../../../shared/components/form/Upload'
import ImagePreview from '../../../../../shared/components/ImagePreview'
import { Input } from '@material-ui/core'
import { getUserID } from '../../../../../core/services/rbacServices'
import { useDispatch } from 'react-redux'

const VehicleDetails = ({ isModalOpen, onClose, bikeDetails, enhancedImages = [], onImageUpload, onImageDownload, onImageDelete, data, onPublish }) => {

  const [img, setImg] = useState([])
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [amount, setAmount] = useState('')
  const [imageProofError, setImageProofError] = useState(false)
  const [priceError, setPriceError] = useState(false)
  const { bikeImages, loanImage, insurenceImage, rcImage } = bikeDetails
  const [images, setImages] = useState([])
  const dispatch = useDispatch()

  const openImageViewer = (images, index) => {
    if (Array.isArray(images)) {
      const imgs = images.map(image => ({ src: image }))
      setImg(imgs)
      setIsImageOpen(true)
      setCurrentIndex(index)
    } else {
      setImg([{ src: images }])
      setIsImageOpen(true)
      setCurrentIndex(index)
    }
  }

  const openBikeImageViewer = (images, index) => {
    if (Array.isArray(images)) {
      const imgs = images.map(image => ({ src: image.imageUrl }))
      setImg(imgs)
      setIsImageOpen(true)
      setCurrentIndex(index)
    } else {
      setImg([{ src: images.imageUrl }])
      setIsImageOpen(true)
      setCurrentIndex(index)
    }
  }

  const closeImageViewer = () => {
    setImg([])
    setIsImageOpen(false)
    setCurrentIndex(0)
  }

  const imageClick = () => {
    if (currentIndex === img.length - 1) return
    setCurrentIndex(currentIndex + 1)
  }

  const closeModal = (event) => {
    if (!isImageOpen) {
      onClose()
    }
  }

  const onChangeOfInput = (e) => {
    const regexp = /^[0-9\b]+$/
    if (e.target.value === '' || regexp.test(e.target.value)) {
      setAmount(e.target.value)
      setPriceError(false)
    }
  }

  const publishBike = () => {
    let payload = {
      inventoryType: 'SHD',
      status: 'PUBLISHED',
      inventoryPrice: amount,
      updatedBy: getUserID()
    }
    
    if(enhancedImages.length === 0 || payload.inventoryPrice === ''){
      if(enhancedImages.length === 0 && payload.inventoryPrice === ''){
        setImageProofError(true)
        setPriceError(true)
      }
      else if(enhancedImages.length === 0){
        setImageProofError(true)
      }
      else if(payload.inventoryPrice === ''){
        setPriceError(true)
      }
      else {
        setImageProofError(false)
        setPriceError(false)
      }
    }
    else {
      onPublish(payload)
    }
  }

  const uploadImages = (files) => {
    setImages(files)
    if(files.length > 0){
      setImageProofError(false)
    }
    onImageUpload(files)
  }

  return (
    <Fragment>
      <Dialog open={isModalOpen} onClose={onClose} disableEscapeKeyDown onEscapeKeyDown={closeModal}>
        <DialogTitle>View Vehicle Images &amp; Documents <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
        <DialogContent>
          <div className="doc-image-conatiner">
            <p className="name">Bike Images:</p>
            {
              Boolean(bikeImages && bikeImages.length) ?
                <div className="doc-image">
                  {
                    bikeImages.map((bike, index) =>
                      <img
                        key={bike}
                        alt="Bike Images"
                        className="doc"
                        src={bike}
                        onClick={() => openImageViewer(bikeImages, index)}
                      />
                    )
                  }
                  <button
                    className="btn-outline--small blue bulk-download"
                    onClick={onImageDownload}
                    type="button"
                  >
                    Download All Images
                  </button>
                </div> :
                <p>NA</p>
            }
          </div>
          <div className="doc-image-conatiner">
            <p className="name">RC Image:</p>
            {
              Boolean(rcImage) ?
                <div className="doc-image">
                  <img
                    className="doc"
                    alt="RC Docs"
                    src={rcImage}
                    onClick={() => openImageViewer(rcImage, 0)}
                  />
                </div> :
                <p>NA</p>
            }
          </div>
          <div className="doc-image-conatiner">
            <p className="name">Loan Image:</p>
            {
              Boolean(loanImage) ?
                <div className="doc-image">
                  <img
                    className="doc"
                    alt="Loan Docs"
                    src={loanImage}
                    onClick={() => openImageViewer(loanImage, 0)}
                  />
                </div> :
                <p>NA</p>
            }
          </div>
          <div className="doc-image-conatiner">
            <p className="name">Insurance Image:</p>
            {
              Boolean(insurenceImage) ?
                <div className="doc-image">
                  <img
                    className="doc"
                    alt="Insurance Docs"
                    src={insurenceImage}
                    onClick={() => openImageViewer(insurenceImage, 0)}
                  />
                </div> :
                <p>NA</p>
            }
          </div>
          <div className="doc-image-conatiner">
            <p className="name">Enhanced Image:</p>
            {
              Boolean(enhancedImages.length) ?
                <div className="doc-image">
                  {
                    enhancedImages.map((newImages, id) =>
                      <ImagePreview
                        key={newImages.imageId}
                        url={newImages.imageUrl}
                        onImageClick={() => openBikeImageViewer(enhancedImages, id)}
                        onRemove={() => onImageDelete(newImages.imageId)}
                      />
                    )
                  }
                </div> :
                <p>NA</p>
            }
          </div>
          <div className="doc-image-conatiner">
            <p className="name">Enter Price</p>
            <Input value={amount} onChange={onChangeOfInput} />
            {
              priceError && <p style={{color: 'red'}}> *Please Enter amount </p>
            }
          </div>
          <div className="upload-enhancee-images">
            <Upload
              name="Upload Enhanced Images"
              multiple
              accept="image/*"
              disabled={enhancedImages.length === 7}
              onFileChange={uploadImages}
            />
            <button className="btn-outline--small blue ml-2" onClick={publishBike}>Confirm</button>
            {
            imageProofError && <p style={{ color: 'red', marginTop: 0, marginRight:160 }}> *Please upload images</p>
            }
          </div>
        </DialogContent>
      </Dialog>
      <ImageViewer
        backdropCloseable
        isOpen={isImageOpen}
        imgs={img}
        currImg={currentIndex}
        onClose={closeImageViewer}
        closeBtnTitle='Close'
        rightArrowTitle="Next"
        leftArrowTitle="Previous"
        onClickNext={() => setCurrentIndex(currentIndex + 1)}
        onClickPrev={() => setCurrentIndex(currentIndex - 1)}
        onClickImg={imageClick}
      />
    </Fragment>
  )
}

export default VehicleDetails