import { Card, CardActions, CardContent, FormHelperText, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { renderString } from '../../../../../core/utility/stringUtility'
import { isRegistrationNumber } from '../../../../../core/utility'
import { getUserID } from '../../../../../core/services/rbacServices'
import { EditIcon } from '../../../../../core/utility/iconHelper'
import { editYearOrRegNo } from '../../../../../core/services/documentQcServices';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../../redux/actions/notificationAction';

export const useStyles = makeStyles({
    root: {
        width: '29rem',
        marginBottom: '2rem', borderRadius: '0.5rem'
    },
    table: {
        '& .MuiTableCell-root': {
            borderBottom: 'none',
            padding: '7px 70px 0px 0px',
            whiteSpace: 'nowrap',
        },
    },
    cell: {
        color: 'rgba(0, 0, 0, 0.5)'
    },
})
export default function LeadDetails({ LeadInfoCustomer, rowInfo, status }) {

    const dispatch = useDispatch();
    const classes = useStyles()
    const [enableRegNo, setEnableRegNo] = useState(false)
    const [regError, setRegError] = useState(false)
    const [regNo, setRegNo] = useState(LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.bikeRegistrationNumber && LeadInfoCustomer.vehicleDetails.bikeRegistrationNumber)

    const enableRegNumber = () => {
        setEnableRegNo(true)
    }

    const handleRegNo = (e) => {
        setRegNo(e.target.value)
        let regRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{2,3}[0-9]{4}$/
        let R = regRegex.test(e.target.value.toString().toUpperCase())
        if (!R)
            setRegError(true)
        else
            setRegError(false)
    }

    const onInputEnterRegNo = (e) => {
        if (e.keyCode === 13) {
            const payload = {
                leadId: LeadInfoCustomer.vehicleDetails.leadId,
                updatedBy: getUserID(),
                regNumber: e.target.value,
                gatepassId: LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.bikeGatepassId
                    .replace(LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.bikeRegistrationNumber, e.target.value)
                    .replace(
                        LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.bikeManufacturerYear, LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.bikeManufacturerYear
                    ),
            };
            editYearOrRegNo(payload).then((apiResponse) => {
                if (apiResponse.isValid) {
                    dispatch(setNotification('success', 'Success', apiResponse.message));
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message));
                }
                setEnableRegNo(false);
            });
        }
    };

    const getStatus = (leadStatus) => {
        if(leadStatus === 'AUCTION_COMPLETED'){
          return <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 5px', borderRadius: '4px',width:'102px' }}>Auction Completed</span> 
        }
        if(leadStatus === 'Central_Tagging_Inspected'){
          return <span style={{ backgroundColor: '#FFE1C5', color: '#B96716', padding: '1px 5px', borderRadius: '4px',width:'102px' }}>CT Inspected</span>
        }
        if(leadStatus === 'DROPPED'){
          return <span style={{ backgroundColor: '#FFD4D6', color: '#DA2128', padding: '1px 5px', borderRadius: '4px',width:'102px' }}>Dropped</span>
        }
        if(leadStatus === 'SELL'){
            return <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 5px', borderRadius: '4px',width:'102px' }}>Sell</span>
        }
        if(leadStatus === 'EXCHANGE'){
            return <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 5px', borderRadius: '4px',width:'102px' }}>Exchange</span>
        }
        if( leadStatus === 'ONGOING'){
          return  <span style={{ backgroundColor: '#E9F4FF', color: '#366896', padding: '1px 15px', borderRadius: '4px' }}> Ongoing </span>
        }else{
            return <span style={{ backgroundColor: '#E9F4FF', color: '#366896', padding: '1px 15px', borderRadius: '4px' }}> {leadStatus} </span>
        }
      }

    return (
        <>
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant='h6' component='h2'>Customer Details </Typography>
                    <Table className={classes.table}>
                        <TableContainer >
                            <TableHead >
                                <TableRow>
                                    <TableCell className={classes.cell}>Name</TableCell>
                                    <TableCell >{renderString(LeadInfoCustomer && LeadInfoCustomer.customerInfo && LeadInfoCustomer.customerInfo.userName && LeadInfoCustomer.customerInfo.userName)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.cell}>Email</TableCell>
                                    <TableCell >{renderString(LeadInfoCustomer && LeadInfoCustomer.customerInfo && LeadInfoCustomer.customerInfo.userEmail && LeadInfoCustomer.customerInfo.userEmail)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.cell}>Pincode</TableCell>
                                    <TableCell >{renderString(LeadInfoCustomer && LeadInfoCustomer.customerInfo && LeadInfoCustomer.customerInfo.pincode && LeadInfoCustomer.customerInfo.pincode)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.cell}>City</TableCell>
                                    <TableCell >{renderString(rowInfo.cityName)}</TableCell>
                                </TableRow>
                                <TableRow style={{verticalAlign:'baseline'}}>
                                    <TableCell className={classes.cell}>Address</TableCell>
                                    <TableCell style={{whiteSpace:'normal'}} >{renderString(LeadInfoCustomer && LeadInfoCustomer.customerInfo && LeadInfoCustomer.customerInfo.address && LeadInfoCustomer.customerInfo.address)}</TableCell>
                                </TableRow>
                            </TableHead>
                        </TableContainer>
                    </Table>
                </CardContent>
            </Card>
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant='h6' component='h2'>Lead Details </Typography>
                    <Table className={classes.table}>
                        <TableContainer >
                            <TableHead >
                                <TableRow>
                                    <TableCell className={classes.cell}>Lead Status</TableCell>
                                    <TableCell >
                                        {LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadStatus && getStatus(LeadInfoCustomer.vehicleDetails.leadStatus)}
                                        {/* <div className={getClassName(renderString(LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadStatus && LeadInfoCustomer.vehicleDetails.leadStatus.replaceAll('_', ' ')))}>
                                            {renderString(LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadStatus && LeadInfoCustomer.vehicleDetails.leadStatus.replaceAll('_', ' '))}</div> */}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.cell}>Lead ID</TableCell>
                                    <TableCell >{renderString(LeadInfoCustomer && LeadInfoCustomer.vehicleDetails && LeadInfoCustomer.vehicleDetails.leadId && LeadInfoCustomer.vehicleDetails.leadId)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.cell}>Registration Number</TableCell>
                                    <TableCell>
                                        <input
                                            value={regNo}
                                            autoFocus
                                            disabled={!enableRegNo}
                                            onChange={(e) => handleRegNo(e)}
                                            onKeyDown={(e) => onInputEnterRegNo(e)}
                                            // onKeyPress={(e) => onKeyPressEvent(e)}
                                        ></input>
                                        <span style={{ cursor: 'pointer' }}><img src={EditIcon} height="15px" style={{ width: '2rem' }} onClick={enableRegNumber} /> </span>
                                        {
                                            regError && <FormHelperText style={{ color: 'red' }}> *Please enter valid Reg No. </FormHelperText>
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </TableContainer>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}