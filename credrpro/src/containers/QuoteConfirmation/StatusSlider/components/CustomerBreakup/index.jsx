import React from 'react'
import { Chip, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import { getAmount, renderString } from '../../../../../core/utility';


export default function CustomerBreakup({ shdOrderInfo }) {
    const useStyles = makeStyles((theme) => ({
        tableHeader: {
            height: '1.75rem',
            backgroundColor: '#4D4D4D',

        },
        head: {
            color: 'white',
            fontWeight: '500'
        },
        chip: {
            backgroundColor: '#DAF2DD', color: '#196834', height: '1.5rem', width: '8rem'
        },
        tablerow: {
            '& .MuiTableCell-root': {
                borderBottom: 'none'
            }
        }
    }))
    const classes = useStyles();

    const totalDeduction = () => {
        const { leeway, cityLevelCommission, credrPlusAmount, docQc2Deductions, extraShdCommission, shdDeductions,jcEstimateCost } = shdOrderInfo
        const { userHpRtoCharges, userMiscellaneous, userNocCharges, userTrafficChalan } = shdOrderInfo.userDeductions
        let totalAmt = 0

        if (leeway) totalAmt += Number(leeway)
        if (userTrafficChalan) totalAmt += Number(userTrafficChalan)
        if (docQc2Deductions) totalAmt += Number(docQc2Deductions)
        if (userHpRtoCharges) totalAmt += Number(userHpRtoCharges)
        if ((shdOrderInfo && shdOrderInfo.soldTo && shdOrderInfo.soldTo === "CP") && extraShdCommission) totalAmt += Number(extraShdCommission)
        if ((shdOrderInfo && shdOrderInfo.soldTo && shdOrderInfo.soldTo === "CP") && cityLevelCommission) totalAmt += Number(cityLevelCommission)
        // if (jcEstimateCost) totalAmt += Number(jcEstimateCost)
        // if (userNocCharges) totalAmt += Number(userNocCharges)
        return totalAmt
    }
    return (
        <TableContainer component={Paper} style={{ width: '25rem', borderRadius: '13px' }}>
            <Table size='small'>
                <TableHead>
                    <TableRow className={classes.tableHeader}>
                        <TableCell>
                            <Typography variant='body1' className={classes.head}>Break Up</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='body1' className={classes.head}>Amount</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            {(shdOrderInfo && shdOrderInfo.soldTo) ?  (shdOrderInfo.soldTo === 'CP' ?
                                <Typography variant='subtitle2' style={{ margin: '1rem 0 1rem 0' }}>Highest Bid</Typography> :
                                <Typography variant='subtitle2' style={{ margin: '1rem 0 1rem 0' }}>Procurement Amount</Typography>):
                                <Typography variant='subtitle2' style={{ margin: '1rem 0 1rem 0',color:'red' }}>Prices not Arrived</Typography>
                            }
                        </TableCell>
                        <TableCell>{(shdOrderInfo && shdOrderInfo.soldTo) ? (shdOrderInfo.soldTo === 'CP' ?
                            getAmount(shdOrderInfo.highestBid) : getAmount(shdOrderInfo.newProcurementPrice)) : <></>
                        }</TableCell>
                    </TableRow>
                    <Typography variant='subtitle2' style={{ margin: '1rem 0 0 1rem' }}>Deductions</Typography>
                    <TableRow className={classes.tablerow}>
                        <TableCell>Traffic Challan</TableCell>
                        <TableCell>{getAmount(shdOrderInfo.userDeductions.userTrafficChalan)}</TableCell>
                    </TableRow>
                    <TableRow className={classes.tablerow}>
                        <TableCell>Leeway</TableCell>
                        <TableCell>{getAmount(shdOrderInfo.leeway)}</TableCell>
                    </TableRow>
                    <TableRow className={classes.tablerow}>
                        <TableCell>Doc Missing</TableCell>
                        <TableCell>{getAmount(shdOrderInfo.docQc2Deductions)}</TableCell>
                    </TableRow>
                    <TableRow className={classes.tablerow}>
                        <TableCell>Ownership Charges</TableCell>
                        <TableCell>{getAmount(shdOrderInfo.ownershipCharges)}</TableCell>
                    </TableRow>
                    <TableRow className={classes.tablerow}>
                        <TableCell>RTO Charges</TableCell>
                        <TableCell>{getAmount(shdOrderInfo.userDeductions.userHpRtoCharges)}</TableCell>
                    </TableRow>
                    {(shdOrderInfo && shdOrderInfo.soldTo && shdOrderInfo.soldTo === "CP") && 
                    <TableRow className={classes.tablerow}>
                        <TableCell>Extra Commission</TableCell>
                        <TableCell>{getAmount(shdOrderInfo.extraShdCommission)}</TableCell>
                    </TableRow>}
                    {(shdOrderInfo && shdOrderInfo.soldTo && shdOrderInfo.soldTo === "CP") &&
                    <TableRow className={classes.tablerow}>
                        <TableCell>City Commission</TableCell>
                        <TableCell>{(shdOrderInfo && shdOrderInfo.soldTo && shdOrderInfo.soldTo === "CP") ? getAmount(shdOrderInfo.cityLevelCommission) : getAmount(0)}</TableCell>
                    </TableRow>}
                    {/* <TableRow className={classes.tablerow}>
                        <TableCell>NOC Charges</TableCell>
                        <TableCell>{getAmount(shdOrderInfo.userDeductions.userNocCharges)}</TableCell>
                    </TableRow> */}
                    {/* <TableRow className={classes.tablerow}>
                        <TableCell>Job Card Estimate</TableCell>
                        <TableCell>{getAmount(shdOrderInfo.jcEstimateCost)}</TableCell>
                    </TableRow> */}
                    <TableRow>
                        <TableCell style={{ color: '#DA2128', fontSize: 'medium', fontWeight: '500' }}>Total Deductions</TableCell>
                        <TableCell style={{ color: '#DA2128', fontSize: 'medium', fontWeight: '500' }}>{getAmount(totalDeduction())}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{ color: '#55B7EF', fontSize: '1rem', fontWeight: '600' }}>Customer Payable</TableCell>
                        <TableCell style={{ color: '#55B7EF', fontSize: '1rem', fontWeight: '600' }}>{(shdOrderInfo && shdOrderInfo.userPayableAmount) ? getAmount(shdOrderInfo.userPayableAmount) : '-'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}