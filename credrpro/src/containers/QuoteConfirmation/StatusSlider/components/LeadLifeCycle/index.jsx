import { Chip, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React from 'react'
import ViewBreakup from './ViewBreakup';
import { getDate, renderString } from '../../../../../core/utility/stringUtility'

export default function LeadLifecycle({ leadLifeInfoCustomer, rowInfo, status,showStore }) {

    const { channelPartnerResponseBean, documentsResponse, logisticsResponseBean, payoutDetailsResponseBean, soldDataResponseBean } = leadLifeInfoCustomer

    const useStyles = makeStyles((theme) => ({
        tableHeader: {
            height: '2rem',
            backgroundColor: '#333333',
            color: 'white', fontWeight:'500',display:'flex',justifyContent:'center',alignItems:'center'
        },
        approvechip: {
            backgroundColor: '#DAF2DD', color: '#196834', height: '1.5rem', width: '8rem', fontWeight: '500',borderRadius:'5px'
        },
        pendingchip: {
            backgroundColor: '#FFE1C5', color: '#B96716', height: '1.5rem', width: '8rem', fontWeight: '500',borderRadius:'5px'
        },
        modalButton: {
            textAlign: 'right', borderBottom: '1px solid #87AACA', color: '#87AACA', fontSize: 'smaller', fontWeight: '600', cursor: 'pointer',
            position: 'relative', left: '150%'
        },
        container: {
            display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '2rem',
            '& .MuiTableCell-root': {
                borderBottom: 'none'
            }
        },
        leftCell: {
            color: 'rgba(0, 0, 0, 0.5)',
            fontWeight: '500',width:'50%'
        },
        delayChip: {
            backgroundColor: '#FFD4D6',
            color: '#DA2128',
            borderRadius: '2px',
            width: '7.2rem',
            fontSize: 'smaller',
            fontWeight: '500',
            height: '1.1rem',
            position: 'relative',
            // top: '1rem',
            right: '-0.2rem'
            // marginBottom:'2px'
        }
    }))
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const getStatus = (lifecycleStatus) => {
        if(lifecycleStatus === 'APPROVED'){
          return <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 15px', borderRadius: '4px',fontWeight:'500' }}>Approved</span> 
        }
        if(lifecycleStatus === 'PENDING'){
          return <span style={{ backgroundColor: '#FFE1C5', color: '#B96716', padding: '1px 15px', borderRadius: '4px',fontWeight:'500' }}>Pending</span>
        }
        if(lifecycleStatus === 'REJECTED'){
          return <span style={{ backgroundColor: '#FFD4D6', color: '#DA2128', padding: '1px 15px', borderRadius: '4px',fontWeight:'500' }}>Rejected</span>
        }
        if(lifecycleStatus === 'SELL'){
            return <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 15px', borderRadius: '4px',fontWeight:'500' }}>Sell</span>
        }
        if(lifecycleStatus === 'EXCHANGE'){
            return <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 15px', borderRadius: '4px',fontWeight:'500' }}>Exchange</span>
        }
        if( lifecycleStatus === 'ONGOING'){
          return  <span style={{ backgroundColor: '#E9F4FF', color: '#366896', padding: '1px 15px', borderRadius: '4px',fontWeight:'500' }}> Ongoing </span>
        }else{
            return <span style={{ backgroundColor: '#E9F4FF', color: '#366896', padding: '1px 15px', borderRadius: '4px',fontWeight:'500' }}> {lifecycleStatus} </span>
        }
      }

    return (
        <>
        {console.log(showStore,'kljlds')}
            <div className={classes.container}>
                <div style={{display:'flex',gap: '2rem'}}>
                <TableContainer component={Paper} style={{ width: '25rem', borderRadius: '13px' }}>
                    <Typography variant='subtitle1' className={classes.tableHeader}>DOC QC</Typography>
                    <Table size='small'>
                        <TableBody>
                            {documentsResponse &&
                                <>
                                    <TableRow>
                                        <TableCell className={classes.leftCell}>DOC QC Status</TableCell>
                                        <TableCell>{documentsResponse && documentsResponse.docStatus && getStatus(documentsResponse.docStatus)}</TableCell>
                                    </TableRow>
                                    <Typography variant='subtitle2' style={{ margin: '0 1rem' }}>DOC QC1</Typography>
                                    <TableRow>
                                        <TableCell className={classes.leftCell}>Agent Name</TableCell>
                                        <TableCell>{renderString(documentsResponse.docQc1DoneBy)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.leftCell}>Approval Date</TableCell>
                                        <TableCell>{getDate(documentsResponse.docQc1DoneDate)}</TableCell>
                                    </TableRow>
                                    <Typography variant='subtitle2' style={{ margin: '0 1rem' }}>DOC QC2</Typography>
                                    <TableRow>
                                        <TableCell className={classes.leftCell}>Agent Name</TableCell>
                                        <TableCell>{renderString(documentsResponse.docQc2DoneBy)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.leftCell}>Approval Date</TableCell>
                                        <TableCell>{getDate(documentsResponse.docQc2DoneDate)}</TableCell>
                                    </TableRow>
                                </>}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} style={{ width: '25rem', borderRadius: '13px' }}>
                    <Typography variant='subtitle1' className={classes.tableHeader}>PAYOUT</Typography>
                    <Table size='small'>
                        <TableBody>

                            <TableRow>
                                <TableCell className={classes.leftCell}>Payout Status</TableCell>
                                <TableCell>{payoutDetailsResponseBean && payoutDetailsResponseBean.payoutStatus && getStatus((payoutDetailsResponseBean.payoutStatus))}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Payment Mode</TableCell>
                                <TableCell>{(payoutDetailsResponseBean && payoutDetailsResponseBean.paymentMode) ? renderString(payoutDetailsResponseBean.paymentMode): '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>User Name</TableCell>
                                <TableCell>{(payoutDetailsResponseBean && payoutDetailsResponseBean.payoutDoneBy) ? renderString(payoutDetailsResponseBean.payoutDoneBy) : '-'}</TableCell>
                            </TableRow>
                            <Typography variant='subtitle2' style={{ margin: '0 1rem' }}>Payout</Typography>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Initiation Date</TableCell>
                                <TableCell>{(payoutDetailsResponseBean && payoutDetailsResponseBean.payoutRequestedDate) ? getDate(payoutDetailsResponseBean.payoutRequestedDate) : '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Completion Date</TableCell>
                                <TableCell>{(payoutDetailsResponseBean && payoutDetailsResponseBean.paymentDoneDate) ? getDate(payoutDetailsResponseBean.paymentDoneDate) : '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>UTR</TableCell>
                                <TableCell>{(payoutDetailsResponseBean && payoutDetailsResponseBean.utr ) ? renderString(payoutDetailsResponseBean.utr) : '-'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
                <div style={{display:'flex',gap: '2rem'}}>
                <TableContainer component={Paper} style={{ width: '25rem', borderRadius: '13px' }}>
                    <Typography variant='subtitle1' className={classes.tableHeader}>LOGISTICS</Typography>
                    <Table size='small'>
                        <TableBody>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Logistics Status</TableCell>
                                <TableCell>{logisticsResponseBean && logisticsResponseBean.logisticsStatus && getStatus(logisticsResponseBean.logisticsStatus)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>In-Custody Status</TableCell>
                                <TableCell>{logisticsResponseBean && logisticsResponseBean.inCustodyStatus && getStatus(logisticsResponseBean.inCustodyStatus)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Logistics Coordinator</TableCell>
                                <TableCell>{(logisticsResponseBean && logisticsResponseBean.coordinatorName) ? renderString(logisticsResponseBean && logisticsResponseBean.coordinatorName) : '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Runner Name</TableCell>
                                <TableCell>{(logisticsResponseBean && logisticsResponseBean.runnerName) ? renderString(logisticsResponseBean && logisticsResponseBean.runnerName) : '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Schedule Date</TableCell>
                                <TableCell>{(logisticsResponseBean && logisticsResponseBean.scheduledDate) ? getDate(logisticsResponseBean && logisticsResponseBean.scheduledDate) : '-'}{(logisticsResponseBean && logisticsResponseBean.delayedDays) && <Chip className={classes.delayChip} label={`Delayed by ${renderString(logisticsResponseBean && logisticsResponseBean.delayedDays)}d`} />}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>In-transit Date</TableCell>
                                <TableCell>{(logisticsResponseBean && logisticsResponseBean.pickedUpDate) ? getDate(logisticsResponseBean && logisticsResponseBean.pickedUpDate) : '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Delivery Date</TableCell>
                                <TableCell>{(logisticsResponseBean && logisticsResponseBean.deliverdDate) ? getDate(logisticsResponseBean && logisticsResponseBean.deliverdDate) :'-'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {!showStore &&
                    <TableContainer component={Paper} style={{ width: '25rem', borderRadius: '13px' }}>
                    <Typography variant='subtitle1' className={classes.tableHeader}>CHANNEL PARTNER</Typography>
                    <Table size='small'>
                        <TableBody>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Payment Status</TableCell>
                                <TableCell>{channelPartnerResponseBean && channelPartnerResponseBean.paymentStatus && getStatus(channelPartnerResponseBean.paymentStatus)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Fin Verification Status</TableCell>
                                <TableCell>{channelPartnerResponseBean && channelPartnerResponseBean.finVerificationStatus && getStatus(channelPartnerResponseBean.finVerificationStatus)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Payment Mode</TableCell>
                                <TableCell>{(channelPartnerResponseBean && channelPartnerResponseBean.paymentMode ) ? renderString(channelPartnerResponseBean && channelPartnerResponseBean.paymentMode) : '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Payment Date</TableCell>
                                <TableCell>{(channelPartnerResponseBean && channelPartnerResponseBean.paymentDate) ? getDate(channelPartnerResponseBean && channelPartnerResponseBean.paymentDate) :'-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.leftCell}>Fin Verification Date</TableCell>
                                <TableCell>{(channelPartnerResponseBean) &&  getDate(channelPartnerResponseBean && channelPartnerResponseBean.finVerificationDate)}</TableCell>
                            </TableRow>
                            {channelPartnerResponseBean && channelPartnerResponseBean.paymentMode && <span className={classes.modalButton} onClick={handleClickOpen}>View Breakup</span>}
                        </TableBody>
                    </Table>
                </TableContainer>}
                </div>
                <div style={{display:'block',width:'100%'}}>
                {status === 'SOLD' &&
                    <TableContainer component={Paper} style={{ width: '25rem', borderRadius: '13px' }}>
                        <Typography variant='subtitle1' className={classes.tableHeader}>SOLD</Typography>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={classes.leftCell}>Release Status</TableCell>
                                    <TableCell>{soldDataResponseBean && soldDataResponseBean.releaseStatus && getStatus(soldDataResponseBean.releaseStatus)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.leftCell}>Marked As</TableCell>
                                    <TableCell>{soldDataResponseBean && soldDataResponseBean.markedStatus && getStatus(soldDataResponseBean.markedStatus)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.leftCell}>Sold By</TableCell>
                                    <TableCell>{(soldDataResponseBean && soldDataResponseBean.soldBy) ? renderString(soldDataResponseBean && soldDataResponseBean.soldBy):'-' }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.leftCell}>Sold Date</TableCell>
                                    <TableCell>{(soldDataResponseBean && soldDataResponseBean.soldDate) ? getDate(soldDataResponseBean && soldDataResponseBean.soldDate): '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.leftCell}>Released By</TableCell>
                                    <TableCell>{(soldDataResponseBean && soldDataResponseBean.relasedBy) ? renderString(soldDataResponseBean && soldDataResponseBean.relasedBy): '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.leftCell}>Release Date</TableCell>
                                    <TableCell>{(soldDataResponseBean && soldDataResponseBean.releasedDate) ? getDate(soldDataResponseBean && soldDataResponseBean.releasedDate): '-'}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>}
                    </div>
            </div>
            <ViewBreakup handleClose={handleClose} open={open} paymentList={channelPartnerResponseBean} />
        </>
    )
}