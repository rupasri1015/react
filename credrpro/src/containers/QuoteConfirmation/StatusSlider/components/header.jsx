import { Box, Button, makeStyles, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import './style.scss'
import CloseIcon from '@material-ui/icons/Close';
import { WhiteEditIcon } from '../../../../core/utility/iconHelper'
import { renderString } from '../../../../core/utility';
import { leadDetails } from '../../../../redux/actions/biddingDetailsAction';
import { useState } from 'react';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { getBiddingList } from '../../../../core/services/biddingServices'
import { getUserID } from '../../../../core/services/rbacServices';
import { setNotification } from '../../../../redux/actions/notificationAction';
import { useDispatch } from "react-redux"

export default function Header({ close, enableVal, status, callCustomer, openBid, paymentStatus, auctionComp, docStatus, updateComm, openStatus, LeadInfoCustomer, openAuthorize, enableEdit, tabValue, onUpdateStaus, show, responseMessage, formPayload, leadData, onReassign,openReassign }) {

    const [showEnable, setShowEnable] = useState(true)
    const dispatch = useDispatch()

    const useStyles = makeStyles({
        container: {
            height: '5rem',
            background: '#111328',
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            top: '0',
            width: '100%',
            left: '0px'
        },
        header: {
            '& .MuiTableCell-root': {
                borderBottom: 'none',
                color: 'white',
                fontSize: '1rem',
                padding: '2px 25px 0px 29px'
            },
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            // width: '60%',
            // paddingRight: '2rem',
            '& .MuiButton-root': {
                borderRadius: '0.7rem',
                color: 'white',
                width: '12rem',
                height: '3rem',
                padding: '0 1rem',
                margin: '0 0.5rem'
            }
        },
        updateBtn: {
            backgroundColor: '#55B7EF', borderRadius: '0.5rem', color: 'white', fontSize: '16px', height: '2rem'
        },
        updateDisabledBtn: {
            backgroundColor: 'blue', borderRadius: '0.5rem', color: 'white', fontSize: '16px', height: '2rem'
        },
        cancelBtn: {
            backgroundColor: '#E59342', borderRadius: '0.5rem', color: 'white', fontSize: '16px', height: '2rem'
        }

    })
    const classes = useStyles()

    const onEnable = () => {
        // setShowEnable(!showEnable)
        enableEdit(!showEnable)
    }
    const onCloseEnable = () => {
        enableEdit(true)
    }

    const onUpdateChange = () => {
        onUpdateStaus('call', formPayload)
    }

    const getStatusValue = () => {
        if (status === 'PENDING' || status === 'FOLLOWUP') return true
        return false
    }

    const updateStatus = () => {
        openStatus(leadData.leadStatus)
    }

    const getReassign = () => {
        if (status === 'PENDING' || status === 'FOLLOWUP') return true
        return false
    }

    const reAssign = () => {
        onReassign(leadData)
    }

    const onOnlySold = () => {
        if (status === 'SOLD') return true
        return false
    }

    const onStartBidding = (val) => {
       const payload = {
           pageNum: 1,
           status: 'ONGOING',
           userId: getUserID()
       }
       getBiddingList(payload).
       then(apiResponse => {
           if(apiResponse.isValid){
               if(apiResponse.ongoingCount < 6){
                openBid(val)
           }
           else{
            openBid('no bid')
            dispatch(setNotification('danger', 'Error', 'Too many vehicles in bidding. Try later'))
           }
        }
       })
    }

    return (
        <Box className={classes.container}>
            <Table className={classes.header}>
                <TableContainer >
                    <TableHead >
                        <TableRow>
                            <TableCell >Lead ID</TableCell>
                            <TableCell align='right'>{renderString(LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadId && LeadInfoCustomer.vehicleDetails.leadId)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Reg. No.</TableCell>
                            <TableCell align='right'>{renderString(LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.bikeRegistrationNumber && LeadInfoCustomer.vehicleDetails.bikeRegistrationNumber)}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </TableContainer>
            </Table>
            { (show && tabValue === 'Commission') &&
                <div>
                    <Typography variant='body1' style={{ backgroundColor: '#47B26C', color: 'white', width: "28rem", fontWeight: '500', height: '32px', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}><ErrorOutlineIcon />{responseMessage}</Typography>
                </div>
            }
            {
                tabValue === 'Lead Details' &&
                <Box className={classes.buttonContainer}>
                    {getReassign() && (LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadStatus && LeadInfoCustomer.vehicleDetails.leadStatus !== "REAUCTION_STARTED")  &&
                        <Button variant='contained' style={{ backgroundColor: '#4caf50', width: '8rem' }}
                            onClick={() => openReassign()}
                        >Re-Assign</Button>}
                    {getStatusValue() && (LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadStatus && LeadInfoCustomer.vehicleDetails.leadStatus !== "REAUCTION_STARTED") &&
                        <Button variant='contained' style={{ backgroundColor: '#55B7EF', width: '8rem' }}
                            onClick={() => onStartBidding('bid')}
                        >Bid</Button>}
                    {status === 'DROP' && (LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadStatus && LeadInfoCustomer.vehicleDetails.leadStatus !== "REAUCTION_STARTED") &&
                        <Button variant='contained' style={{ backgroundColor: '#55B7EF', width: '8rem' }}
                            onClick={() => onStartBidding('flip')}
                        >FLIP</Button>}
                    {(getStatusValue()) && (LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadStatus && LeadInfoCustomer.vehicleDetails.leadStatus !== "REAUCTION_STARTED") &&
                        <Button variant='contained' style={{ backgroundColor: '#F4AC5F' }}
                            onClick={() => updateStatus('other')}
                        >Update Status</Button>}
                    {
                        status !== 'UNASSIGNED' &&
                        <Button variant='contained' style={{ backgroundColor: '#47B26C' }}
                        onClick={() => callCustomer()}
                    >Call Customer</Button>
                    }
                </Box>
            }
            {
                tabValue === 'Commission' && paymentStatus === 'PENDING' &&
                <Box className={classes.buttonContainer} style={{ float: 'right' }} >
                    {
                        enableVal ?

                            <Button variant='contained' style={{ backgroundColor: '#55B7EF' }} onClick={onEnable}><span style={{ cursor: 'pointer', marginRight: '10px' }} ><img src={WhiteEditIcon} height="15px" /> </span>Enable Edit</Button> :
                            <>
                                <Button variant='contained' className={classes.cancelBtn} onClick={onCloseEnable}><CloseIcon style={{ marginRight: '1rem' }} />Cancel</Button>
                                <Button variant='contained' className={classes.updateBtn} onClick={onUpdateChange}><DoneIcon style={{ marginRight: '1rem' }} />Update</Button>
                            </>
                    }
                </Box>
            }
            {
                tabValue === 'Commission' &&
                <Box className={classes.buttonContainer} style={{ float: 'right' }} >
                    {onOnlySold() &&
                        <Button variant='contained' style={{ backgroundColor: '#F4AC5F' }}
                            onClick={() => updateStatus('sold')}
                        >Update Status</Button>
                    }
                    {
                        status === 'SOLD' && docStatus === 'APPROVED' &&
                        <Button variant='contained' style={{ backgroundColor: '#55B7EF', width: '15rem', float: 'right' }}
                            onClick={() => openAuthorize(LeadInfoCustomer && LeadInfoCustomer.vehicleDetails.leadId)}
                        >Release Authorization</Button>
                    }
                </Box>
            }
            <CloseIcon style={{ color: 'white', cursor: 'pointer', marginRight: '2rem' }} onClick={close} />
        </Box>
    )
}
