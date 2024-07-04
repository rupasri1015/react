import { Button, Card, CardActions, CardContent, Grid, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useState } from "react";
import { useStyles } from "../LeadDetails";
import ImageViewer from 'react-images-viewer'
import { renderString, getBikeNameYear } from '../../../../../core/utility';

export default function DocumentDetails({ VehicleDetails, BankDetails, Images }) {

    const classes = useStyles();
    const [currentIndex, setCurrentIndex] = useState(0)
    const [images, setImages] = useState([])
    const [isImageOpen, setImageOpen] = useState(false)
    const imagesList = Images && Images.filter(img => img.leadParameterType === 'IMAGE')
    const videoList = Images && Images.filter(img => img.leadParameterType === 'VIDEO')

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
        <div
            style={{ display: 'flex', flexFlow: 'row wrap', gap: '0 1rem' }}>
            <div>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant='h6' component='h2'>Vehicle Details </Typography>
                        <Table className={classes.table}>
                            <TableContainer >
                                <TableHead >
                                    <TableRow>
                                        <TableCell className={classes.cell}>MMVY</TableCell>
                                        <TableCell > {getBikeNameYear(VehicleDetails.bikeManufactureName,VehicleDetails.bikeModelName, VehicleDetails.bikeVariantName, VehicleDetails.bikeManufacturerYear)} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>Registration Number</TableCell>
                                        <TableCell > {renderString(VehicleDetails.bikeRegistrationNumber)} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>RC Name</TableCell>
                                        <TableCell > {renderString(VehicleDetails.rcName)} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>No.of Owners</TableCell>
                                        <TableCell > {renderString(VehicleDetails.noOfUsers)} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>Finance (Y/N)</TableCell>
                                        <TableCell > {VehicleDetails.bikeFinance ? 'Yes' : 'No'} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>Insurance (Y/N)</TableCell>
                                        <TableCell > {VehicleDetails.insurance ? 'Yes' : 'No'} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>RC Availability</TableCell>
                                        <TableCell > {VehicleDetails.rcName ? 'Yes' : 'No'} </TableCell>
                                    </TableRow>
                                </TableHead>
                            </TableContainer>
                        </Table>
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant='h6' component='h2'>Bank Details </Typography>
                        <Table className={classes.table}>
                            <TableContainer >
                                <TableHead >
                                    <TableRow>
                                        <TableCell className={classes.cell}>Account Type</TableCell>
                                        <TableCell > {VehicleDetails && VehicleDetails.accountType ? renderString(VehicleDetails.accountType) : 'NA'} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>A/c Holder Name</TableCell>
                                        <TableCell > {BankDetails && BankDetails.accountHolderName ? renderString(BankDetails.accountHolderName) : 'NA'} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>Account Number</TableCell>
                                        <TableCell > {BankDetails && BankDetails.accountNumber ? renderString(BankDetails.accountNumber) : 'NA'} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>IFSC Code</TableCell>
                                        <TableCell > {BankDetails && BankDetails.ifscCode ? renderString(BankDetails.ifscCode) : 'NA'} </TableCell>
                                    </TableRow>
                                </TableHead>
                            </TableContainer>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant='h6' component='h2'>Documents & Images </Typography>
                        <div className="doc-container">
                            <Typography style={{ color: '#757575' }} variant='body1'>Vehicle Images</Typography>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}>
                                {(imagesList && Boolean(imagesList.length)) ? imagesList.map((image, index) => (
                                    <div className='doc-preview'
                                        style={{ padding: '0.5rem', cursor: 'pointer', height: '5rem', width: '6rem' }}
                                        key={index}
                                        onClick={() => openImageViewer(imagesList, index, 'leadParameterValue', 'leadParameterName')}
                                    >
                                        <img
                                            src={image.leadParameterValue}
                                            alt={image.leadParameterName}
                                            style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
                                        />
                                    </div>
                                )) :
                                    <Typography variant='body2' style={{ marginLeft: '10px', fontSize: '0.8rem' }}>NA</Typography>
                                }
                            </div>
                        </div>
                        <div className="doc-container">
                            <Typography style={{ color: '#757575' }} variant='body1'>Vehicle Video</Typography>
                            <div className="docs">
                                {videoList && Boolean(videoList.length) ?
                                    Array(videoList[0]).map((video, index) => (
                                        <div className="doc-preview"
                                            // style={{ padding: '0.5rem', cursor: 'pointer', width: '6rem', height: '5rem' }}
                                            key={index}>
                                            <video
                                                src={video.leadParameterValue}
                                                key={video.leadParameterValue}
                                                height="100px"
                                                width='100%'
                                                style={{ maxWidth: '200px',borderRadius: '0.5rem' }}
                                                controls
                                            >
                                                <p>Video Not Supported</p>
                                            </video>
                                        </div>
                                    ))
                                    :
                                    <Typography variant='body2' style={{ marginLeft: '10px', fontSize: '0.8rem' }}>NA</Typography>
                                }
                            </div>
                        </div>
                        <div className="doc-container">
                            <Typography style={{ color: '#757575' }} variant='body1'>Engine Video</Typography>
                            <div className="docs">
                                {videoList && Boolean(videoList.length) ?
                                    Array(videoList[1]).map((video, index) => (
                                        <div className="doc-preview"
                                            // style={{ padding: '0.5rem', cursor: 'pointer', width: '6rem', height: '5rem' }}
                                            key={index}>
                                            <video
                                                src={video.leadParameterValue}
                                                key={video.leadParameterValue}
                                                height="100px"
                                                width='100%'
                                                style={{ maxWidth: '200px',borderRadius: '0.5rem' }}
                                                controls
                                            >
                                                <p>Video Not Supported</p>
                                            </video>
                                        </div>
                                    ))
                                    :
                                    <Typography variant='body2' style={{ marginLeft: '10px', fontSize: '0.8rem' }}>NA</Typography>
                                }
                            </div>
                        </div>
                        <div className="doc-container">
                            <Typography style={{ color: '#757575' }} variant='body1'>RC Image</Typography>
                            <div className='docs'>
                                {
                                    VehicleDetails.bikeRcImage ?
                                        <div className='doc-preview'
                                            style={{ padding: '0.5rem', cursor: 'pointer', height: '5rem', width: '6rem' }}
                                            onClick={() => openImageViewer(renderString(VehicleDetails.bikeRcImage), 0, null, "RC")}>
                                            <img src={renderString(VehicleDetails.bikeRcImage)} alt="Vehicl Doc" style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }} />
                                        </div> :
                                        <Typography variant='body2' style={{ marginLeft: '10px', fontSize: '0.8rem' }}>NA</Typography>
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
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

        </div>
    )
}