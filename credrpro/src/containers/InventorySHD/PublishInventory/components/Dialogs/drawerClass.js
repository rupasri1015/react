import React, { useState, useEffect, useRef } from 'react';
import edit from '../../../../../shared/img/icons/edit.svg'
import Drawer from '@material-ui/core/Drawer'
import ImageEditorDialog from '../Dialogs/imageEditor'
import ImagePreview from '../../../../../shared/components/ImagePreview'
import { uploadEnhancedImages } from '../../../../../core/services/inventoryServices'
import { setNotification } from '../../../../../redux/actions/notificationAction'
// import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { useDispatch } from 'react-redux';
import { uploadMultiImages } from '../../../../../core/services/documentQcServices';
import { checkPropTypes } from 'prop-types';
import "../../../AcceptReject/components/Dialogs/dialog.scss"
import Close from '@material-ui/icons/Close';
const DrawerSHD = ({ drawer, enhancedImages, data, closeDrawer, handleReject, rowData, onRefreshPage }) => {

    const [img, setImg] = useState('')
    const [enhancedImgs, setEnhancedImgs] = useState([])
    const [enhancedIndex, setEnhancedIndex] = useState()
    const [imageSrc, setImageSrc] = useState([]);
    const [index, setIndex] = useState(currentIndex)
    const [showEnhancedImgs, setShowEnhancedImgs] = useState(true)
    const [showMgs, setShowMgs] = useState(false)
    const [showError, setShowError] = useState(false)
    const [exist, setExist] = useState(false)
    const [isImageOpen, setIsImageOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [ipdIpId, setipdIpId] = useState('')
    const [showNoImg, setShowNoImg] = useState(false)

    // const [closeDrawer, setCloseDrawer] = useState(false)
    const [ibdVal, setIbdVal] = useState('')
    const dispatch = useDispatch();
    const checkImg = () => {
        if (enhancedImages.bikeImagesList && enhancedImages.bikeImagesList.length > 0) {
            if (imageSrc && imageSrc.length > 0)
                return true
            else
                return true
        }
        else
            return false
    }
    // const usePrevious = (value) => {
    //     const ref = useRef();
    //     useEffect(() => {
    //       ref.current = value;
    //     });
    //     return ref.current
    //   };

    // const prevStatus = usePrevious(enhancedImgs)

    // useEffect(() => {
    //     if((prevStatus !== enhancedImgs || prevStatus === enhancedImgs)) {
    //         console.log('enhancedImgs1234use')
    //     }
    //   }, [enhancedImgs])

    const openBikeImageViewer = (images, index) => {
        setipdIpId(images.ipdIpId)
        setShowEnhancedImgs(false)
        setImg(images.ipdValue)
        setCurrentIndex(index)
        setIbdVal(images.ibdId)
        setIsImageOpen(true)
    }

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

    const closeModal = () => {
        setIsImageOpen(false)
    }

    const handleEnhancedImages = (imgs, index) => {
        setEnhancedImgs(imgs)
        setEnhancedIndex(index)
        setIsImageOpen(false)
    }

    const handleRejectInventory = () => {
        let imgUrls = []
        imageSrc.map((data) => {
            imgUrls.push(data.img)
        })
        if (imageSrc.length === mappedValue.length) {

            rowData.imageUrlList = imgUrls
            setImageSrc([])
            handleReject(rowData)
            closeDrawer()
            setIsImageOpen(false)
            setImageSrc([])
            setShowMgs(false)
        }
        else {
            setShowMgs(true)
        }
    }
    const uploadImg = (img) => {
        uploadMultiImages(img)
            .then(apires => {
                if (apires.isValid) {
                    if (imageSrc.length <= mappedValue.length) {
                        console.log(imageSrc.filter(item => item.ipdIpId == ipdIpId), "CHECK")
                        let found = imageSrc.filter(item => item.ipdIpId == ipdIpId)
                        if (found && found.length)
                            setExist(true)
                        else {
                            imageSrc.push({ leadid: rowData.id, img: apires.urls[0], ipdIpId: ipdIpId })
                            setExist(false)
                        }
                        setShowMgs(false)
                        setShowError(false)
                    }
                    else
                        setShowError(true)
                    setShowNoImg(false)
                    setIndex(currentIndex)
                    handleEnhancedImages(apires.urls, currentIndex)
                }
            })
    }

    let mappedValue = enhancedImages.inspectionParameterDetailsList !== undefined && enhancedImages.inspectionParameterDetailsList.filter((his) => his.ipdValue.startsWith('https'))

    return (
        <>
            <Drawer className={drawer} anchor='right' variant="permanent">
                <div className="col-12 pl-0 pr-0">
                    <h4 className='call-header'>Image Enhancement <Close className='float-right' style={{ marginRight: "10px", marginTop: "5px", cursor: "pointer" }} onClick={() => { closeDrawer(); setShowEnhancedImgs(true) }} /></h4>
                </div>
                <div className="col-12 headerWrap">
                    Uploaded Images
                </div>
                <div className="col-12 doc-image-conatiner">
                    {
                        enhancedImages.inspectionParameterDetailsList &&
                            Boolean(enhancedImages.inspectionParameterDetailsList.length) ?
                            <div className="doc-image">
                                {
                                    mappedValue.map((bike, index) =>
                                        <>
                                            <img
                                                key={bike.id}
                                                alt="Uploaded Bike Images"
                                                className="doc"
                                                src={bike.ipdValue}
                                            // onClick={() => openImageViewer(bike, index)}
                                            />
                                            <img src={edit} alt="edit" style={{ width: '15px', marginBottom: '10px', verticalAlign: 'bottom', marginLeft: '-8px', cursor: 'pointer' }} onClick={() => openBikeImageViewer(bike, index)} />
                                        </>
                                    )
                                }
                            </div> :
                            <div className="doc-image" style={{ paddingLeft: '16px' }}>
                                <p style={{ margin: '0px auto !important' }}>No Images</p>
                            </div>
                    }
                </div>
                <div className="col-12 headerWrap">
                    Enhanced Images
                </div>
                <div className="doc-image-conatiner">
                    <div className="doc-image">
                        {console.log(mappedValue, 'enhancedImages.bikeImagesList')
                        }
                        {

                            console.log(imageSrc, 'imageSrc')

                        }
                        {
                            showEnhancedImgs && enhancedImages.bikeImagesList &&
                            Boolean(enhancedImages.bikeImagesList.length) &&

                            enhancedImages.bikeImagesList.map((bike, index) => {
                                {/* if (bike.ibdId === ibdVal) {
                                    if (index === currentIndex && enhancedImgs) {
                                        bike.imageUrl = enhancedImgs
                                    }
                                } */}
                                return (
                                    <img
                                        key={index}
                                        alt="Enhanced Bike Images"
                                        className="doc"
                                        src={bike.imageUrl}
                                    // onClick={() => openImageViewer(bikeImages, index)}
                                    />
                                )
                            }
                            )


                        }
                        {
                            !showEnhancedImgs && imageSrc &&
                            Boolean(imageSrc.length) &&

                            imageSrc.map((bike, index) => {
                                {/* if (bike.ibdId === ibdVal) {
                                    if (index === currentIndex && enhancedImgs) {
                                        bike.imageUrl = enhancedImgs
                                    }
                                } */}
                                return (
                                    <img
                                        key={index}
                                        alt="Enhanced Bike Images"
                                        className="doc"
                                        src={bike.img}
                                    // onClick={() => openImageViewer(bikeImages, index)}
                                    />
                                )
                            }
                            )


                        }
                        {/* <div className="doc-image"> */}
                        {/* {
                            imageSrc && imageSrc.length &&
                            imageSrc.map((data, index) => {
                                    return (
                                        <img
                                            key={index}
                                            alt="Enhanced Bike Images"
                                            className="doc"
                                            src={data.img}
                                        // onClick={() => openImageViewer(bikeImages, index)}
                                        />
                                    )
                                

                            })
                        } */}

                        {
                            showMgs &&
                            <p style={{ color: "red", textAlign: "center" }}>Please Edit remaining {mappedValue.length - imageSrc.length} images</p>
                        }
                        {
                            showError &&
                            <p style={{ color: "red", textAlign: "center" }}>Images Cannot exceed {mappedValue.length}</p>
                        }
                        {
                            exist &&
                            <p style={{ color: "red", textAlign: "center" }}>Image Already Edited</p>

                        }
                        {/* { checkImg &&
                            <div className="doc-image" style={{ paddingLeft: '16px' }}>
                                <p style={{ margin: '0px auto !important' }}>No Images</p>
                            </div>

                        } */}
                    </div>
                </div>
                {
                    checkImg() &&
                    <div style={{ backgroundColor: '#FAFAFA', paddingLeft: '17px', paddingBottom: '40px', paddingTop: '30px' }}>
                        <button className="rejectSHD" onClick={handleRejectInventory}>Unpublish</button>
                    </div>

                }
            </Drawer>
            {
                isImageOpen &&
                <ImageEditorDialog
                    isImageOpen={isImageOpen}
                    closeModal={closeModal}
                    closeDrawer={closeDrawer}
                    img={img}
                    uploadImage={uploadImg}
                    currentIndex={currentIndex}
                    handleEnhancedImages={(imgs, index) => handleEnhancedImages(imgs, index)}
                />
            }
        </>
    );
}

export default DrawerSHD