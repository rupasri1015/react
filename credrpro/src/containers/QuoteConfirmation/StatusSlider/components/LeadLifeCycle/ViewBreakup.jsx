import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { getAmount, getDate, renderString } from '../../../../../core/utility';
import ImageViewer from 'react-images-viewer'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewBreakup({ handleClose, open, paymentList }) {

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
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                style={{ width: '50rem', margin: '0px auto' }}
            >
                {paymentList && Boolean(paymentList.length) && paymentList.paymentMode && paymentList.paymentMode === 'WALLET' ?
                    <>
                        <DialogTitle id="alert-dialog-slide-title">{"Wallet"}<CloseIcon className="float-right" style={{ cursor: 'pointer' }} onClick={handleClose} /></DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                <Table size="small" >
                                    <TableHead style={{ backgroundColor: "#CEE1F2" }}>
                                        <TableRow>
                                            {
                                                ['Wallet Trx ID', 'Amount', 'Date'].map(value => (
                                                    <TableCell
                                                        key={value}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentList && Boolean(paymentList.length) &&
                                            paymentList.paymentReceipts.map((receipt) => (
                                                <TableRow key={receipt} tabIndex={-1} style={{ backgroundColor: '#F3F3F3' }}>
                                                    <TableCell>{renderString(receipt.walletTxnId)}</TableCell>
                                                    <TableCell>{getAmount(receipt.amount)}</TableCell>
                                                    <TableCell>{getDate(receipt.paymentDate)}</TableCell>
                                                </TableRow>
                                            )
                                            )
                                        }

                                    </TableBody>
                                </Table>
                            </DialogContentText>
                        </DialogContent>
                    </> :
                    <>
                        <DialogTitle id="alert-dialog-slide-title">{"Offline Break-Up"}<CloseIcon className="float-right" style={{ cursor: 'pointer' }} onClick={handleClose} /></DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                <Table size="small" >
                                    <TableHead style={{ backgroundColor: "#CEE1F2" }}>
                                        <TableRow>
                                            {
                                                ['Receipt', 'Amount', 'Date', 'UTR Number'].map(value => (
                                                    <TableCell
                                                        key={value}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentList && Boolean(paymentList.length) &&
                                            paymentList.paymentReceipts.map((receipt) => (
                                                <TableRow key={receipt} tabIndex={-1} style={{ backgroundColor: '#F3F3F3' }}>
                                                    <TableCell>
                                                        <div className='doc-preview'
                                                            style={{ padding: '0.5rem', cursor: 'pointer', height: '5rem', width: '6rem' }}
                                                            onClick={() => openImageViewer(renderString(receipt.receiptUrl), 0, null, "Receipt")}>
                                                            <img src={renderString(receipt.receiptUrl)} alt="Receipt" style={{ width: '100%', height: '100%' }} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{getAmount(receipt.amount)}</TableCell>
                                                    <TableCell>{getDate(paymentList.paymentDate)}</TableCell>
                                                    <TableCell>{renderString(receipt.utrNum)}</TableCell>
                                                </TableRow>
                                            ))
                                        }

                                    </TableBody>
                                </Table>
                            </DialogContentText>
                            <DialogTitle className="float-right" id="alert-dialog-slide-title">{`Total :${paymentList && getAmount(paymentList.amount)}`} </DialogTitle>
                        </DialogContent>
                    </>
                }
            </Dialog>
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
    );
}
