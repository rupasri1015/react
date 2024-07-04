import React from 'react'
import {Card, CardActions, CardContent, Table, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core';
import {useStyles} from '../LeadDetails/index'
import { renderString } from '../../../../../core/utility';

export default function FhdStoreDetails({LeadInfoCustomer}) {
    const {storeDetails,userBankDocs,storeAccountDetails} = LeadInfoCustomer
    const classes = useStyles()
    return (
        <>
        {console.log(userBankDocs,'data')}
        <Card className={classes.root}>
            <CardContent>
                <Typography variant='h6' component='h2'>Outlet Details </Typography>
                <Table className={classes.table}>
                    <TableContainer >
                        <TableHead >
                            <TableRow>
                                <TableCell className={classes.cell}>Outlet Name</TableCell>
                                <TableCell >{(storeDetails && storeDetails.storeName) ? renderString(storeDetails.storeName) : 'NA'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.cell}>Outlet Location</TableCell>
                                <TableCell >{(storeDetails && storeDetails.storeLocation) ? renderString(storeDetails.storeLocation) : 'NA'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.cell}>Outlet Number</TableCell>
                                <TableCell >{(storeDetails && storeDetails.storeContactNumber) ? renderString(storeDetails.storeContactNumber): 'NA'}</TableCell>
                            </TableRow>
                        </TableHead>
                    </TableContainer>
                </Table>
            </CardContent>
        </Card>
        <Card className={classes.root}>
            <CardContent>
                <Typography variant='h6' component='h2'>Outlet Bank Details </Typography>
                <Table className={classes.table}>
                    <TableContainer >
                        <TableHead >
                            <TableRow>
                                <TableCell className={classes.cell}>Account Type</TableCell>
                                <TableCell >{((storeAccountDetails && storeAccountDetails.length)) ? renderString(storeAccountDetails.accountType) : 'NA'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.cell}>Account Holder Name</TableCell>
                                <TableCell >{(storeAccountDetails && storeAccountDetails.length)  ? renderString(storeAccountDetails.accountHolderName) : 'NA'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.cell}>Account Number</TableCell>
                                <TableCell >{(storeAccountDetails && storeAccountDetails.length)  ? renderString(storeAccountDetails.accountNumber) : 'NA'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.cell}>IFSC Code</TableCell>
                                <TableCell >{(storeAccountDetails && storeAccountDetails.length)  ? renderString(storeAccountDetails.ifscCode) : 'NA'}</TableCell>
                            </TableRow>
                        </TableHead>
                    </TableContainer>
                </Table>
            </CardContent>
        </Card>
        </>
    )
}