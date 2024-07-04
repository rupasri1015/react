import React, { useState } from 'react';
import ImageViewer from 'react-images-viewer'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { ButtonGroup, Card, CardContent, Chip, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { getAmount, getDate, renderString } from '../../../../../core/utility';
import { useStyles } from '../LeadDetails/index'
import { useEffect } from 'react';
import { updateReleaseAuth } from '../../../../../core/services/biddingServices';
import { hideLoader, showLoader } from '../../../../../redux/actions/loaderAction';
import { setNotification } from '../../../../../redux/actions/notificationAction';
import { useDispatch } from 'react-redux';
import { getUserID } from '../../../../../core/services/rbacServices';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReleaseAuthorize({ onClose, open ,orderDedctions, rowInfo,authData,refreshPage}) {

    const newStyles = makeStyles((theme) => ({
        chipStyle: {
            backgroundColor: '#FFE1C5',
            color: '#B96716',
            borderRadius: '2px',
            width: '6rem',
            fontSize: 'small',
            fontWeight: '400',
            height: '1.1rem',
            marginLeft: '1rem'
        },
        dialogBox: {
            '$ .MuiDialog-root': {
                maxWidth: '30rem'
            }
        },
        tableRow: {
            '& .MuiTableCell-root': {
                borderBottom: 'none'
            }
        },
        disputeBtn:{
            borderRadius: '0.5rem', backgroundColor: '#E59342', color: 'white',width:'74px',height:'24px'
        },
        disputeBtnSelected:{
            border:'2px solid #E59342',
            backgroundColor:'white',
            color:'#E59342',borderRadius: '0.5rem',width:'74px',height:'24px'
        },
        verifyBtn:{
            borderRadius: '0.5rem', color: 'white' ,
            backgroundColor: '#47B26C',width:'74px',height:'24px'
        },
        verifyBtnSelected:{
            border:'2px solid #196834',
            backgroundColor:'white',
            color:'#196834',borderRadius: '0.5rem',width:'74px',height:'24px'
        },
        releaseAuthBtnActive:{
            backgroundColor: '#55B7EF', borderRadius: '0.5rem', color: 'white', fontSize: 'small', width: '13rem', height: '2rem'
        },
        releaseAuthBtnDisable:{
            backgroundColor:'#979797', borderRadius: '0.5rem', color: 'white', fontSize: 'small', width: '13rem', height: '2rem'
        }
    }))
    const authClasses = newStyles()
    const classes = useStyles()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [images, setImages] = useState([])
    const [isImageOpen, setImageOpen] = useState(false)
    const [enableVerifyOne,setEnableVerifyOne] = useState(false)
    const [enableVerifyTwo,setEnableVerifyTwo] = useState(false)
    const [enableDisputeOne,setEnableDisputeOne] = useState(false)
    const [enableDisputeTwo,setEnableDisputeTwo] = useState(false)
    const dispatch = useDispatch()

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

    const verifyOne =(val) => {
        setEnableVerifyOne(!enableVerifyOne)
        setEnableDisputeOne(false)
        setEnableDisputeTwo(false)
    }
    const verifyTwo =(val) => {
        setEnableVerifyTwo(!enableVerifyTwo)
        setEnableDisputeOne(false)
        setEnableDisputeTwo(false)
    }
    const dispuetOne =(val) => {
        setEnableVerifyOne(false)
        setEnableVerifyTwo(false)
        setEnableDisputeOne(!enableDisputeOne)
    }
    const disputeTwo =(val) => {
        setEnableVerifyOne(false)
        setEnableVerifyTwo(false)
        setEnableDisputeTwo(!enableDisputeTwo)
    }
    const handleAuthRelease =(leadId,userId, type) => {
        const payload={}
        payload.leadId = leadId
        payload.userId = getUserID()
        if(type === 'D')
        payload.status = 'DISPUTE'
        else payload.status = 'RELEASE'
        dispatch(showLoader())
        updateReleaseAuth(payload)
        .then(apiRes => {
            if (apiRes.isValid) {
              dispatch(hideLoader())
              dispatch(setNotification('success', 'Success', apiRes.message));
              refreshPage()
            }
            else {
                dispatch(setNotification('danger', 'Error', apiRes.message));
                dispatch(hideLoader())
            }
          })
    }

    const getDisabled = () => {
        if(enableVerifyOne && enableVerifyTwo) return true
        if(enableDisputeTwo || enableDisputeOne) return false
    }

    const getStatusType = () => {
        if(enableDisputeTwo || enableDisputeOne) return true
    }

    const getStatus = (authStatus) => {
        if(authStatus === 'DISPUTE'){
          return <span style={{ backgroundColor: '#FFD4D6', color: '#DA2128', padding: '1px 5px', borderRadius: '4px',fontSize:'13px',marginLeft:'10px' }}>In Dispute</span>
        }
        if(authStatus === 'RELEASED'){
            return <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 5px', borderRadius: '4px',fontSize:'13px',marginLeft:'10px' }}>Released</span>
        }
        else{
            return <span style={{backgroundColor: '#FFE1C5', color: '#B96716', padding: '1px 5px', borderRadius: '4px',fontSize:'13px',marginLeft:'10px' }}>Pending</span>
        }
      }
    return (
        <div className={authClasses.dialogBox}>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={onClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                style={{ width: '100%' }}
            >
                <DialogTitle id="alert-dialog-slide-title">{"Release Authorisation"}{!getDisabled() && getStatus(authData.authStatus)}<CloseIcon className="float-right" style={{ cursor: 'pointer' }} onClick={onClose} /></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Card className={classes.root} style={{ margin: '1rem auto' }}>
                            <CardContent>
                                <Typography variant='subtitle2'> Verify Break-Up</Typography>
                                <Typography variant='subtitle2'>Sold To : {authData.soldTo === 'CP' ? 'Channel Partner' : 'Store'}</Typography>
                                <Table size="small" className={authClasses.tableRow} >
                                    <TableHead style={{ backgroundColor: "#CEE1F2" }}>
                                        <TableRow>
                                            <TableCell>Deductions</TableCell>
                                            {authData.soldTo === 'CP' ?
                                            <>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Channel Partner</TableCell>
                                            </> :
                                            <TableCell>Amount</TableCell>}
                                            
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{ backgroundColor: '#F8FBFF' }}>
                                        <TableRow>
                                            <TableCell>Leeway</TableCell>
                                            {authData.soldTo === 'CP' ?
                                            <>
                                            <TableCell>{getAmount(authData.leeway)}</TableCell>
                                            <TableCell>{getAmount(0)}</TableCell>
                                            </> :
                                            <TableCell>{getAmount(authData.leeway)}</TableCell>}
                                            
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Traffic Challan</TableCell>
                                            {authData.soldTo === 'CP' ?
                                            <>
                                            <TableCell>{getAmount(authData.trafficFine)}</TableCell>
                                            <TableCell>{getAmount(authData.trafficFine)}</TableCell>
                                            </> :
                                            <TableCell>{getAmount(authData.trafficFine)}</TableCell>}
                                            
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>HP/RTO Challan</TableCell>
                                            {authData.soldTo === 'CP' ?
                                            <>
                                            <TableCell>{getAmount(authData.rtoFine)}</TableCell>
                                            <TableCell>{getAmount(authData.rtoFine)}</TableCell>
                                            </> :
                                            <TableCell>{getAmount(authData.rtoFine)}</TableCell>}
                                            
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>DOC QC2 Charges</TableCell>
                                            {authData.soldTo === 'CP' ?
                                            <>
                                            <TableCell>{getAmount(authData.docQc2Deductions)}</TableCell>
                                            <TableCell>{getAmount(authData.docQc2Deductions)}</TableCell>
                                            </> :
                                            <TableCell>{getAmount(authData.docQc2Deductions)}</TableCell>}
                                            
                                        </TableRow>
                                        {authData.soldTo === 'CP' && 
                                        <TableRow>
                                            <TableCell>Extra Commission</TableCell>
                                            <>
                                            <TableCell>{getAmount(authData.extraShdCommission)}</TableCell>
                                            <TableCell>{getAmount(authData.extraShdCommission)}</TableCell>
                                            </> 
                                        </TableRow>}
                                        {authData.soldTo === 'CP' &&  
                                        <TableRow>
                                            <TableCell>City Commission</TableCell>
                                            <>
                                            <TableCell>{getAmount(authData.cityLevelCommission)}</TableCell>
                                            <TableCell>{getAmount(authData.cityLevelCommission)}</TableCell>
                                            </> 
                                        </TableRow>}
                                        <TableRow>
                                            <TableCell style={{ fontWeight: '500' }}>Payable Amount</TableCell>
                                            {authData.soldTo === 'CP' ?
                                            <>
                                            <TableCell style={{ fontWeight: '500' }}>{getAmount(authData.userPayableAmount)}</TableCell>
                                            <TableCell style={{ fontWeight: '500' }}>{getAmount(authData.shdPaymentAmount)}</TableCell>
                                            </> :
                                            <TableCell style={{ fontWeight: '500' }}>{getAmount(authData.userPayableAmount)}</TableCell>}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                {authData.authStatus !== 'RELEASED' && 
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                    <Button  variant='contained' className={!enableDisputeOne ? authClasses.disputeBtnSelected :authClasses.disputeBtn} onClick={()=> dispuetOne(true)} size='small'>Dispute</Button>
                                    <Button className={!enableVerifyOne ? authClasses.verifyBtnSelected: authClasses.verifyBtn} onClick={()=> verifyOne(false)} variant='contained' size='small'>Verify</Button>
                                </div>}
                            </CardContent>
                        </Card>
                        <Card className={classes.root} style={{ maxWidth: '30rem', margin: '1rem auto' }} >
                            <CardContent>
                                <Typography variant='subtitle2'> Verify Bank Details </Typography>
                                <Table className={classes.table}>
                                    <TableContainer >
                                        <TableHead >
                                            <TableRow>
                                                <TableCell className={classes.cell}>Account Type</TableCell>
                                                <TableCell >{renderString(authData.accountType)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={classes.cell}>A/c Holder Name</TableCell>
                                                <TableCell >{renderString(authData.accountHolderName)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={classes.cell}>Account Number</TableCell>
                                                <TableCell >{renderString(authData.accountNumber)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={classes.cell}>IFSC Code</TableCell>
                                                <TableCell >{renderString(authData.ifscCode)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={classes.cell}>Cheque Image</TableCell>
                                                <TableCell >
                                                    {
                                                        authData.cheque ?
                                                            <div style={{height:'4rem',width:'6rem'}} onClick={() => openImageViewer(renderString(authData.cheque), 0, null, "RC")}>
                                                                <img src={renderString(authData.cheque)} alt="Vehicl Doc" style={{width:'100%',height:'100%'}}/>
                                                            </div> :
                                                            "NA"
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                    </TableContainer>
                                </Table>
                                {authData.authStatus !== 'RELEASED'  && 
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                    <Button variant='contained' className={!enableDisputeTwo ? authClasses.disputeBtnSelected :authClasses.disputeBtn} onClick={()=> disputeTwo(true)} size='small'>Dispute</Button>
                                    <Button className={!enableVerifyTwo ? authClasses.verifyBtnSelected: authClasses.verifyBtn} onClick={()=> verifyTwo(false)} variant='contained' size='small' >Verify</Button>
                                </div>}
                            </CardContent>
                        </Card>
                        {authData.authStatus !== 'RELEASED' && 
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <Button disabled={!getStatusType() ? !getDisabled() : false} onClick={()=> handleAuthRelease(rowInfo.leadId,rowInfo.userId, getStatusType() ? 'D' : 'R')} className={ authClasses.releaseAuthBtnActive} variant='contained'> {getStatusType() ? 'Dispute' : 'Release Authorization' }  </Button>
                        </div>}
                    </DialogContentText>
                </DialogContent>
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
            </Dialog>
        </div>
    );
}
