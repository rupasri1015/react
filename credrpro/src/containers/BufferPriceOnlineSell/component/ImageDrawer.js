import React, { useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import viewEye from '../../../shared/img/icons/left-chevron.png'
import ImageViewer from 'react-images-viewer'
import { keys } from 'lodash'


const ImageDrawer = ({ drawer, drawerData, onCloseDrawer }) => {

    const [currentIndex, setCurrentIndex] = useState(0)
    const [images, setImages] = useState([]);
    const [isImageOpen, setImageOpen] = useState(false);
    const [imgList, setImgList] = useState([])

    const openImageViewer = (images, index, key, caption) => {
        if (Array.isArray(images)) {
            const imgs = images.map((image) => ({ src: image[key] }));
            setImages(imgs);
        } else {
            setImages([{ src: images }]);
        }
        setCurrentIndex(index);
        setImageOpen(true);
    };

    const closeImageViewer = () => {
        setImageOpen(false);
        setImages([]);
        setCurrentIndex(0);
    };

    const nextImage = () => {
        setCurrentIndex(currentIndex + 1);
    };

    const previousImage = () => {
        setCurrentIndex(currentIndex - 1);
    };

    const imageClick = () => {
        if (currentIndex === images.length - 1) return;
        nextImage();
    };

    const checkImagesAvailability = () => {
        let imageCount = drawerData && drawerData.priceRequestedLeadsImages && Object.values(drawerData.priceRequestedLeadsImages).map(val => val === '' || val === null)
        let checkToF = imageCount && imageCount.includes(false)
        if (checkToF && Boolean(checkToF)) {
            return true
        }
        else return false
    }

    let arrOfObj = drawerData && drawerData.priceRequestedLeadsImages && Object.entries(drawerData.priceRequestedLeadsImages).map(val => ({ ...val }))

    return (
        <Drawer
            className={drawer}
            variant="permanent"
            transitionDuration={{ enter: 500, exit: 1000 }}
            anchor="right"
        >
            <>
                <h5 className='image-drawer-header'>Lead ID - {drawerData && drawerData.leadId} <span style={{float: 'right', color: '#333', cursor: 'pointer'}} onClick={onCloseDrawer}>X</span> </h5>
                <div className='image-drawer-wrap-p-header'>
                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '13px' }}>Vehicle Info</p>
                </div>
                <div className='row' style={{ padding: '15px 14px 10px' }}>
                    <div className='col-4'>
                        <p className='p-subheade'>MMVY</p>
                    </div>
                    <div className='col-8'>
                        <p> {drawerData && drawerData.mmvy} </p>
                    </div>
                    <div className='col-4'>
                        <p className='p-subheade'>Reg num</p>
                    </div>
                    <div className='col-8'>
                        <p> {drawerData && drawerData.registrationNumber} </p>
                    </div>
                </div>
                <div className='image-drawer-wrap-p-header'>
                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '13px' }}>Vehicle Images</p>
                </div>
                {
                    checkImagesAvailability() ?
                        <div className='image-wrap'>
                            {
                                arrOfObj && arrOfObj.map(imgName => (
                                    imgName && imgName[1] === null || imgName[1] === '' ?
                                        <></>
                                        :
                                        <div className='imageinnerDiv'>
                                            <>
                                                <div onClick={() => openImageViewer(imgName && imgName[1], 0, null, "check")}>
                                                    <img
                                                        src={imgName && imgName[1]}
                                                        alt="Bike Images"
                                                        className="imgDiv"
                                                    />
                                                </div>
                                                <span> {imgName && imgName[0] && imgName[0].split(/(?=[A-Z])/)[0]} <br /> {imgName && imgName[0] && imgName[0].split(/(?=[A-Z])/)[1]} </span>
                                            </>
                                        </div>

                                ))
                            }
                        </div>
                        :
                        <p style={{ padding: '15px' }}>No Images Available</p>
                }
                {/* {
                    checkImagesAvailability() ?
                    <div className='image-wrap'>
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.frontView &&
                            <div className='imageinnerDiv'>

                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.frontView, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.frontView}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        // onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.frontView, 0)}
                                        />
                                    </div>
                                    <span>Front</span>
                                </>
                            </div>
                        }
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.rearView &&
                            <div className='imageinnerDiv'>
                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.rearView, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.rearView}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        />
                                    </div>
                                    <span>Back</span>
                                </>
                            </div>
                        }
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.leftView &&
                            <div className='imageinnerDiv'>
                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.leftView, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.leftView}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        />
                                    </div>
                                    <span>Left</span>
                                </>
                            </div>
                        }
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.rightView &&
                            <div className='imageinnerDiv'>
                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.rightView, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.rightView}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        />
                                    </div>
                                    <span>Right</span>
                                </>
                            </div>
                        }
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.odometerReading &&
                            <div className='imageinnerDiv'>
                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.odometerReading, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.odometerReading}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        />
                                    </div>
                                    <span>Odometer</span>
                                </>
                            </div>
                        }
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.frontSuspension &&
                            <div className='imageinnerDiv'>
                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.frontSuspension, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.frontSuspension}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        />
                                    </div>
                                    <span>Front <br /> Suspension</span>
                                </>
                            </div>
                        }
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.rearSuspension &&
                            <div className='imageinnerDiv'>
                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.rearSuspension, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.rearSuspension}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        />
                                    </div>
                                    <span>Rear <br /> Suspension</span>
                                </>
                            </div>
                        }
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.scratchesDents &&
                            <div className='imageinnerDiv'>
                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.scratchesDents, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.scratchesDents}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        />
                                    </div>
                                    <span>Scratch <br /> Dents</span>
                                </>
                            </div>
                        }
                        {
                            drawerData.priceRequestedLeadsImages && drawerData.priceRequestedLeadsImages.sideView &&
                            <div className='imageinnerDiv'>
                                <>
                                    <div onClick={() => openImageViewer(drawerData.priceRequestedLeadsImages.sideView, 0, null, "check")}>
                                        <img
                                            src={drawerData.priceRequestedLeadsImages.sideView}
                                            alt="Bike Images"
                                            className="imgDiv"
                                        />
                                    </div>
                                    <span>Side</span>
                                </>
                            </div>
                        }
                    </div>
                    :
                    <p style={{padding: '15px'}}>No Images Available</p>
                } */}
                <ImageViewer
                    isOpen={isImageOpen}
                    imgs={images}
                    currImg={currentIndex}
                    onClose={closeImageViewer}
                    onClickNext={nextImage}
                    onClickPrev={previousImage}
                    onClickImg={imageClick}
                    backdropCloseable
                />
            </>
        </Drawer>
    )

}

export default ImageDrawer