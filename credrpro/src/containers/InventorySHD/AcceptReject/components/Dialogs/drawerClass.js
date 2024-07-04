import React, { useState, usePrevious, useEffect, useRef } from 'react';
import edit from '../../../../../shared/img/icons/edit.svg'
import Drawer from '@material-ui/core/Drawer'
import ImageEditorDialog from '../Dialogs/ImageEditor'
import ImagePreview from '../../../../../shared/components/ImagePreview'
import { deleteBikeImage, getEnhancedImages, getInventoryImagesZip, uploadEnhancedImages, uplpoadEnhancedImages } from '../../../../../core/services/inventoryServices'
import { setNotification } from '../../../../../redux/actions/notificationAction'
// import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { useDispatch } from 'react-redux';
import { uploadMultiImages } from '../../../../../core/services/documentQcServices';
import { checkPropTypes } from 'prop-types';
import Close from '@material-ui/icons/Close';
import { updateInventory, updateBikeInventory } from '../../../../../core/services/inventoryServices';
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { getDatePayload } from '../../../../../core/utility';
import { getUserID } from '../../../../../core/services/rbacServices';
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import { reduxForm, Field } from 'redux-form'
import ImageViewer from '../../../../../shared/components/ImageViewer'
import { hideLoader, showLoader } from '../../../../../redux/actions/loaderAction';
import Upload from '../../../../../shared/components/form/Upload';
import { saveAs } from 'file-saver'

const validate = values => {
    const errors = {}
    if (!values.remarks) {
        errors.remarks = '* Please Enter Reason'
    }
    return errors
}


const DrawerSHD = ({ drawer, enhancedImages, data, closeDrawer, handleReject, rowData, onRefreshPage, status, id }) => {

    const [img, setImg] = useState('')
    const [enhancedImgs, setEnhancedImgs] = useState()
    const [enhancedIndex, setEnhancedIndex] = useState()
    const [imageSrc, setImageSrc] = useState([]);
    const [index, setIndex] = useState(currentIndex)
    const [showEnhancedImgs, setShowEnhancedImgs] = useState(true)
    const [isImageOpen, setIsImageOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showMgs, setShowMgs] = useState(false)
    const [showNoImg, setShowNoImg] = useState(false)
    const [showError, setShowError] = useState(false)
    const [exist, setExist] = useState(false)
    const [openReasonDialog, setopenReasonDialog] = useState(false)
    const [openRejectDialog, setopenRejectDialog] = useState(false)
    const [ibdVal, setIbdVal] = useState('')
    const [ipdIpId, setipdIpId] = useState('')
    const [rejectReason, setRejectReason] = useState('')
    const [isReason, setIsReasonExist] = useState(false)
    const [previewImg, setPreviewImg] = useState(false)
    const [ibdId, setIbdId] = useState('')
    const [selectedImage, setSelectedImage] = useState([])
    const dispatch = useDispatch();

    const closeImageViewer = () => {
        setPreviewImg(false)
    }
    // const openImageViewer = (img) => {
    //     setPreviewImg(true)
    //     setSelectedImage([{ src: img }])
    // }
    const openBikesImageViewer = (img, id) => {
        // setErrorMsg(false)
        setIbdId(id)
        setPreviewImg(true)
        setSelectedImage([{ src: img }])
    }
    const setReason = (e) => {
        setIsReasonExist(false)
        setRejectReason(e.target.value)
    }

    const usePrevious = (value) => {
        const ref = useRef()
        useEffect(() => {
            ref.current = value;
        });
        return ref.current
    };

    // const prevStatus = usePrevious(status)
    const preId = usePrevious(id)
    useEffect(() => {
        if (preId !== id) {
            setImageSrc([])
            setShowEnhancedImgs(true)
            setShowMgs(false)
            setExist(false)
        }
    }, [id])

    // const prevStatus = usePrevious(enhancedImgs)

    // console.log(enhancedImages.bikeImagesList &&
    //     Boolean(enhancedImages.bikeImagesList.length) &&
    //     enhancedImages.bikeImagesList.map((item) => {
    //             console.log(item, item)
    //     }))

    // useEffect(() => {
    //     let listItem = enhancedImages.bikeImagesList &&
    //         Boolean(enhancedImages.bikeImagesList.length) &&
    //         enhancedImages.bikeImagesList.map((item) => {
    //             return item
    //         })
    //     setImageSrc(listItem)
    // })

    let mappedValue
    if (enhancedImages.inspectionParameterDetailsList && enhancedImages.inspectionParameterDetailsList.length) {
        mappedValue = enhancedImages.inspectionParameterDetailsList !== undefined && enhancedImages.inspectionParameterDetailsList.length && enhancedImages.inspectionParameterDetailsList.filter((his) => his.ipdValue.startsWith('https'))
    }
    else
        mappedValue = enhancedImages.uploadedImagesList !== undefined && enhancedImages.uploadedImagesList && enhancedImages.uploadedImagesList.length && enhancedImages.uploadedImagesList.filter((his) => his.imageUrl.startsWith('https'))

    const openBikeImageViewer = (images, index) => {
        setipdIpId(index + 1)
        setShowEnhancedImgs(false)
        setImg(images.ipdValue)
        setCurrentIndex(index)
        setIbdVal(images.ibdId)
        setIsImageOpen(true)
    }
    const openReject = () => {
        // if (imageSrc.length === mappedValue.length)
        setopenRejectDialog(true)
        // else setShowMgs(true)

    }
    const closeReject = () => {
        setopenRejectDialog(false)
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
        if (!imageSrc.length)
            setShowEnhancedImgs(true)
    }
    const clearImg = () => {
        setShowEnhancedImgs(true)
        setImageSrc([])
        setShowMgs(false)
        setExist(false)
    }

    const handleEnhancedImages = (imgs, index) => {
        setEnhancedImgs(imgs)
        setEnhancedIndex(index)
        setIsImageOpen(false)
    }

    const handleImageUpload = async files => {
        setShowEnhancedImgs(false)
        dispatch(showLoader())
        const formData = new FormData()
        files.forEach(file => {
            formData.append('file', file)
        })
        const uploadResponse = await uplpoadEnhancedImages(formData, id)
        if (!uploadResponse.isValid) {
            const { message } = uploadResponse
            dispatch(setNotification('danger', 'Upload Error', message))
        }
        if (uploadResponse.isValid) {
            const enhancedImages = await getEnhancedImages(id)
            if (enhancedImages.isValid) {
                setEnhancedImgs(enhancedImages.bikeUrls)
            } else {
                setEnhancedImgs([])
            }
        }
        dispatch(hideLoader())
    }
    const handleDownloadZip = () => {
        dispatch(showLoader())
        getInventoryImagesZip(id)
            .then(apiResponse => {
                if (apiResponse) {
                    saveAs(apiResponse, `${id}-Compresed-images.zip`)
                } else {
                    dispatch(setNotification('danger', 'Download Error', 'File Nout Found'))
                }
                dispatch(hideLoader())
            })
    }

    const handleImageDelete = imageId => {
        dispatch(showLoader())
        deleteBikeImage(imageId)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    setEnhancedImgs(
                        enhancedImages.bikeImagesList.filter(image => image.id !== imageId)
                    )
                    setShowEnhancedImgs(false)
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message))
                }
                dispatch(hideLoader())
            })
    }
    const handleEnhancedImgDelete = imageId => {
        dispatch(showLoader())
        deleteBikeImage(imageId)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    setEnhancedImgs(
                        enhancedImgs.filter(image => {
                            if(image.hasOwnProperty('imageId')){
                                return image.imageId !== imageId
                            }
                            return image.id !== imageId
                        })
                    )
                    setShowEnhancedImgs(false)
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message))
                }
                dispatch(hideLoader())
            })
    }

    const handleAcceptChange = (imgs) => {
        let imgUrls = []
        imageSrc.map((data) => {
            imgUrls.push(data.img)
        })

        if (enhancedImgs && enhancedImgs.length) {
            let imagesNew = enhancedImgs &&
                Boolean(enhancedImgs.length) &&
                enhancedImgs.map(bike => {
                    return bike.imageUrl
                })
            const payload = {
                ibdId: id,
                imagesList: imagesNew,
                status: "PUBLISHED",
                updateImages: true,
                userId: getUserID(),
                isSelf: rowData.inventoryType === 'SELF' ? true : false
            }
            // if (imageSrc.length === mappedValue.length) {
            updateBikeInventory(payload)
                .then(apiRes => {
                    if (apiRes.isValid || apiRes.valid) {
                        onRefreshPage()
                        closeDrawer()
                        setIsImageOpen(false)
                        setImageSrc([])
                        setShowMgs(false)
                        setShowEnhancedImgs(true)
                        dispatch(setNotification('success', 'Success', 'Updated successfully'))

                    }
                    else {
                        dispatch(setNotification('danger', 'Error', apiRes.message))
                        setImageSrc([])
                    }
                })
        }
        else {
            dispatch(setNotification('danger', 'Error', 'Please Upload New Messages'))
        }
        // }
        // else {
        //     setShowMgs(true)
        // }
    }
    const handleUnpublishInventory = () => {
        let imageSet = []
        let imgUrls = []
        if (enhancedImages.bikeImagesList && Boolean(enhancedImages.bikeImagesList).length > 0) {
            imageSet = enhancedImages.bikeImagesList &&
                Boolean(enhancedImages.bikeImagesList.length) &&
                enhancedImages.bikeImagesList.map((item) => {
                    return item.imageUrl
                })
            imageSet.map((data) => {
                imgUrls.push(data)
            })
        }
        else {
            imageSet = enhancedImages.uploadedImagesList &&
                Boolean(enhancedImages.uploadedImagesList.length) &&
                enhancedImages.uploadedImagesList.map((item) => {
                    return item.imageUrl
                })
            imageSet.map((data) => {
                imgUrls.push(data)
            })
        }
        // if (imageSet.length === mappedValue.length) {
        const payload = { ibdId: rowData.id, status: 'UNPUBLISHED', imagesList: imgUrls, "updateImages": true, userId: getUserID(), isSelf: rowData.inventoryType === 'SELF' ? true : false }
        updateBikeInventory(payload)
            .then(apiResaponse => {
                if (apiResaponse.valid) {
                    closeDrawer()
                    onRefreshPage()
                    setIsImageOpen(false)
                    setImageSrc([])
                    setShowMgs(false)
                    setopenReasonDialog(false)
                    setShowEnhancedImgs(true)
                    dispatch(setNotification('success', 'Success', "Updated successfully"))
    
                } else {
                    setImageSrc([])
                    dispatch(setNotification('danger', 'Error', apiResaponse.message))
    
                }
    
    
            })
        // }
        // else {
        //     setShowMgs(true)
        // }
    }
    const handleRepublish = (imgs) => {
        let imgUrls = []
        const payload = {}
        if (imageSrc && imageSrc.length) {
            imageSrc.map((data) => {
                imgUrls.push(data.img)
            })

            payload = {
                ibdId: ibdVal,
                imagesList: imgUrls,
                status: "PUBLISHED",
                updateImages: true,
                userId: getUserID()
            }
            // if (imageSrc.length === mappedValue.length) {
            updateBikeInventory(payload)
                .then(apiRes => {
                    if (apiRes.isValid || apiRes.valid) {
                        onRefreshPage()
                        closeDrawer()
                        setIsImageOpen(false)
                        setImageSrc([])
                        setShowMgs(false)
                        setShowEnhancedImgs(true)
                        dispatch(setNotification('success', 'Success', 'Updated successfully'))
                    }
                    else {
                        dispatch(setNotification('error', 'Error', apiRes.message))
                        setImageSrc([])
                    }
                })
            // }
            // else {
            //     setShowMgs(true)
            // }
        }
        else {
            enhancedImages && enhancedImages.length && enhancedImages.bikeImagesList.map((data) => {
                imgUrls.push(data.imageUrl)
            })
            payload = {
                ibdId: ibdVal,
                imagesList: imgUrls,
                status: "PUBLISHED",
                updateImages: true,
                userId: getUserID()
            }
            updateBikeInventory(payload)
                .then(apiRes => {
                    if (apiRes.isValid || apiRes.valid) {
                        onRefreshPage()
                        closeDrawer()
                        setIsImageOpen(false)
                        setImageSrc([])
                        setShowMgs(false)
                        setShowEnhancedImgs(true)
                        dispatch(setNotification('success', 'Success', 'Updated successfully'))

                    }
                    else {
                        dispatch(setNotification('error', 'Error', apiRes.message))
                        setImageSrc([])
                    }
                })
        }
    }
    const closeReasonDialog = () => {
        setopenReasonDialog(false)
    }
    const openResDialog = () => {
        // if (imageSrc.length === mappedValue.length)
        setopenReasonDialog(true)
        // else setShowMgs(true)
    }

    const handleRejectInventory = () => {
        let imageSet = []
        let imgUrls = []
        if (!rejectReason || rejectReason.length < 5){
            setIsReasonExist(true)
        }
        else {
            if (enhancedImages.bikeImagesList && Boolean(enhancedImages.bikeImagesList).length > 0) {
                imageSet = enhancedImages.bikeImagesList &&
                    Boolean(enhancedImages.bikeImagesList.length) &&
                    enhancedImages.bikeImagesList.map((item) => {
                        return item.imageUrl
                    })
                imageSet.map((data) => {
                    imgUrls.push(data)
                })
            }
            else {
                imageSet = enhancedImages.uploadedImagesList &&
                    Boolean(enhancedImages.uploadedImagesList.length) &&
                    enhancedImages.uploadedImagesList.map((item) => {
                        return item.imageUrl
                    })
                imageSet.map((data) => {
                    imgUrls.push(data)
                })
            }
            const payload = {
                ibdId: id,
                imagesList: imageSet,
                status: "REJECTED",
                updateImages: true,
                userId: getUserID(),
                rejectReason: rejectReason,
                isSelf: rowData.inventoryType === 'SELF' ? true : false
            }
    
            // if (imageSrc.length === mappedValue.length) {
            updateBikeInventory(payload)
                .then(apiRes => {
                    if (apiRes.isValid || apiRes.valid) {
                        onRefreshPage()
                        closeDrawer()
                        setIsImageOpen(false)
                        setImageSrc([])
                        setShowMgs(false)
                        setShowEnhancedImgs(true)
                        closeReject()
                        dispatch(setNotification('success', 'Success', 'Updated successfully'))
    
                    }
                    else {
                        setImageSrc([])
                        dispatch(setNotification('error', 'Error', apiRes.message))
    
                    }
                })
        }

        // }
        // else {
        //     setShowMgs(true)
        // }
    }

const getUpdateArray = (data) => {
    let bikes = []
    bikes.ibdId = data.imageId
    bikes.ipdValue = data.imageUrl
    return bikes

}
const uploadImg = (img) => {
    uploadMultiImages(img)
        .then(apires => {
            if (apires.isValid) {
                if (imageSrc.length <= mappedValue.length) {
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
const handleUploadButton =() => {
    if(enhancedImages && enhancedImages.bikeImagesList && enhancedImages.uploadedImagesList){
        if(enhancedImgs){
            return enhancedImgs.length >= enhancedImages.uploadedImagesList.length
        }
        return enhancedImages.bikeImagesList.length >= enhancedImages.uploadedImagesList.length
    }

}
const filesToUpload = files =>{
    let bool;
    if(enhancedImgs){
        bool = enhancedImgs.length + files.length > enhancedImages.uploadedImagesList.length
    }else{
        bool = enhancedImages.bikeImagesList.length + files.length > enhancedImages.uploadedImagesList.length
    }
    if(!bool){
        handleImageUpload(files)
    }else{
        dispatch(setNotification('danger', 'Error', "No. of files exceeded limit"))
    }
}
const enablePublish = () => {
    let bool;
    if(enhancedImages && enhancedImages.uploadedImagesList && enhancedImages.bikeImagesList){
        if(enhancedImgs && enhancedImgs.length > 0 ){
            bool = enhancedImgs.length === enhancedImages.uploadedImagesList.length
            return bool
        }
        else if(enhancedImages.bikeImagesList.length > 0 ){
            bool = enhancedImages.bikeImagesList.length === enhancedImages.uploadedImagesList.length
            return bool;
        }else{
            return false
        }
       
    }
    
}

return (
    <>
        <Drawer className={drawer} anchor='right' variant="permanent">
            <div className="col-12 pl-0 pr-0">
                <h4 className='call-header'>Image Enhancement <Close className='float-right' style={{ marginRight: "10px", cursor: "pointer" }} onClick={() => { closeDrawer(); setShowEnhancedImgs(true); setShowMgs(false) }} /></h4>

            </div>
            <div className="col-12 headerWrap">
                Uploaded Images
                </div>
            <div className="doc-image-conatiner">
                {
                    enhancedImages.inspectionParameterDetailsList &&
                        Boolean(enhancedImages.inspectionParameterDetailsList.length) ?
                        <div className="doc-image">
                            {
                                enhancedImages.inspectionParameterDetailsList.map((bike, index) =>
                                    <>
                                        <img
                                            key={bike.id}
                                            alt="Uploaded Bike Images"
                                            className="doc"
                                            src={bike.ipdValue}
                                            // onClick={() => openImageViewer(bike, index)}
                                            onClick={() => openBikesImageViewer(bike.ipdValue, bike.ibdId)}
                                        />
                                        {/* <img src={edit} alt="edit" style={{ width: '15px', marginBottom: '10px', verticalAlign: 'bottom', marginLeft: '-8px', cursor: 'pointer' }} onClick={() => openImageViewer(bike.ipdValue)} /> */}
                                    </>
                                )
                            }
                            <button
                                className="btn-outline--small blue bulk-download"
                                onClick={handleDownloadZip}
                                type="button"
                            >
                                Download All Images
                                </button>
                        </div> :
                        enhancedImages.uploadedImagesList && Boolean(enhancedImages.uploadedImagesList.length) ?
                            <div className="doc-image">
                                {
                                    enhancedImages.uploadedImagesList.map((bike, index) =>
                                        <>
                                            <img
                                                key={bike.imageId}
                                                alt="Uploaded Bike Images"
                                                className="doc"
                                                src={bike.imageUrl}
                                                // onClick={() => openImageViewer(bike, index)}
                                                onClick={() => openBikesImageViewer(bike.imageUrl, bike.imageId)}
                                            />

                                            {/* <img src={edit} alt="edit" style={{ width: '15px', marginBottom: '10px', verticalAlign: 'bottom', marginLeft: '-8px', cursor: 'pointer' }} onClick={() => openImageViewer(bike.ipdValue)} /> */}
                                        </>
                                    )
                                }
                                <button
                                    className="btn-outline--small blue bulk-download"
                                    onClick={handleDownloadZip}
                                    type="button"
                                >
                                    Download All Images
                                    </button>
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
                    {
                        showEnhancedImgs && enhancedImages.bikeImagesList &&
                        Boolean(enhancedImages.bikeImagesList.length) &&
                        enhancedImages.bikeImagesList.map((bike, index) => {
                            return (
                                // <img
                                //     key={index}
                                //     alt="Enhanced Bike Images"
                                //     className="doc"
                                //     src={bike.imageUrl}
                                //     // onClick={() => openImageViewer(bike.imageUrl)}
                                //     onImageClick={() => openBikeImageViewer(bike.imageUrl, bike.ibdId)}
                                //     onRemove={() => handleImageDelete(bike.imageUrl)}
                                // />
                                <ImagePreview
                                    key={bike.imageId}
                                    url={bike.imageUrl}
                                    onImageClick={() => openBikesImageViewer(bike.imageUrl, bike.ibdId)}
                                    onRemove={() => handleImageDelete(bike.id)}
                                />
                            )
                        })
                    }
                    {
                        !showEnhancedImgs && enhancedImgs &&
                        Boolean(enhancedImgs.length) &&
                        enhancedImgs.map((bike, index) => {
                            return (
                                // <img
                                //     key={index}
                                //     alt="Enhanced Bike Images"
                                //     className="doc"
                                //     src={bike.imageUrl}
                                //     // onClick={() => openImageViewer(bike.img)}
                                //     onImageClick={() => openBikeImageViewer(bike.imageUrl, bike.imageId)}
                                //     onRemove={() => handleImageDelete(bike.imageUrl)}
                                // // onClick={() => openImageViewer(bikeImages, index)}
                                // />
                                <ImagePreview
                                    key={index}
                                    url={bike.imageUrl}
                                    onImageClick={() => openBikesImageViewer(bike.imageUrl, bike.ibdId)}
                                    onRemove={() => handleEnhancedImgDelete(bike.hasOwnProperty('imageId')? bike.imageId : bike.id)}
                                />
                            )
                        })
                    }
                    <div className="upload-enhancee-images">
                        <Upload
                            name="Upload Enhanced Images"
                            multiple
                            accept="image/*"
                            disabled={handleUploadButton()}
                            onFileChange={filesToUpload}
                        />
                    </div>
                    {/* {
                            showMgs &&
                            <p style={{ color: "red", textAlign: "center" }}>Please Edit {mappedValue.length - imageSrc.length} more images</p>
                        } */}
                    {
                        showError &&
                        <p style={{ color: "red", textAlign: "center" }}>Images Cannot exceed {mappedValue.length}</p>
                    }
                    {
                        exist &&
                        <p style={{ color: "red", textAlign: "center" }}>Image Already Edited</p>
                    }
                </div>
            </div>
            <div style={{ backgroundColor: '#FAFAFA', paddingLeft: '17px', paddingBottom: '40px', paddingTop: '30px' }}>

                {
                    rowData.status === "PUBLISHED" &&
                    <button className="rejectSHD" onClick={openResDialog} style={{ marginRight: '13px' }}>UnPublish</button>
                }
                {
                    // !showEnhancedImgs ?
                    //     rowData.status === "PUBLISHED" ?
                    //         <>
                    //             <button className="acceptSHD" onClick={handleAcceptChange}>Re-Publish</button>
                    //             {
                    //                 imageSrc && imageSrc.length && !showEnhancedImgs ?
                    //                     <button className='icon-btn ' style={{ height: "30px", paddingTop: "5px", marginLeft: "10px" }} onClick={clearImg}>Reset</button>
                    //                     : ""
                    //             }
                    //         </>
                    //         :
                    <>
                        {
                            rowData.status !== "REJECTED" &&
                            <button className="rejectSHD" onClick={openReject}>Reject</button>
                        }
                        <button className='acceptSHD' disabled={!enablePublish()} onClick={handleAcceptChange}>Publish</button>
                        {
                            imageSrc && imageSrc.length && !showEnhancedImgs ?
                                <button className='icon-btn ' style={{ height: "30px", paddingTop: "5px", marginLeft: "10px" }} onClick={clearImg}>Reset</button>
                                : ""
                        }
                    </>
                    // : ""
                }
            </div>
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
        {
            openReasonDialog &&
            <Dialog
                open={openReasonDialog}
                onClose={closeReasonDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Unpublish Inventory<span className="float-right" onClick={closeReasonDialog} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
                <DialogContent>
                    <DialogContentText>{`Vehicle ${rowData.registrationNumber} will be unpublished from website.`}</DialogContentText>
                    <DialogActions>
                        <button className="icon-btn" onClick={closeReasonDialog}>Cancel</button>
                        <button className="icon-btn" onClick={handleUnpublishInventory}>Unpublish</button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        }
        {
            openRejectDialog &&
            <Dialog
                open={openRejectDialog}
                onClose={closeReject}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Reject Bike <span className="float-right" onClick={closeReject} style={{ cursor: 'pointer' }}>&#10005;</span>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        name="remarks"
                        className='w-100'
                        onChange={(e) => { setReason(e); }}
                        label="Reason for rejection"
                        required
                        validate={validate}
                    />
                    {
                        isReason &&
                        <p style={{ color: "red" }}><b>Invalid Reason or should be greater than 5 letters</b></p>
                    }
                </DialogContent>
                <DialogActions>
                    <button className="icon-btn" type="button" onClick={closeReject}>Cancel</button>
                    <button className="icon-btn" onClick={handleRejectInventory}>Reject</button>
                </DialogActions>
            </Dialog>
        }
        {
            previewImg &&
            <ImageViewer
                images={selectedImage}
                isOpen={previewImg}
                onClose={closeImageViewer}
                currentIndex={0}
            />
        }

    </>
);
}

export default DrawerSHD