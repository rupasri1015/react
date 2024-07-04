import { Card, CardContent, makeStyles, Chip, Table, TableCell, TableBody, TableHead, TableRow, Typography, } from '@material-ui/core'
import React, { useState } from 'react'
import { Row, Col } from 'reactstrap'
import { WhiteCallIcon } from '../../../../../core/utility/iconHelper'
import { renderString, getDate, getAmount } from '../../../../../core/utility/stringUtility'
import edit from '../../../../../shared/img/icons/edit-icon.svg'

export default function BiddingHistory({ auctionData ,callToBidder, openEditDialog}) {
    const useStyles = makeStyles({
        root: {
            width: '35rem',
            marginTop: '5px',
        },
        table: {
            '&: .MuiTableBody-root': {
                width: '100%'
            }
        }
    })
    const classes = useStyles()
      
    return (
        <>
        {auctionData && Boolean(auctionData.length) ? 
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem 2rem' }}>
        {
            auctionData && Boolean(auctionData.length) && auctionData.map((auction,index) => (
                    <Card className={classes.root} key={index}>
                        <CardContent>
                            <div className="table-wraper" style={{overflow:'hidden'}}>
                                <div className="row">
                                    <div className="col">
                                        <>
                                            <Row style={{ justifyContent: 'space-between' }}>
                                                <Col md={8} style={{ fontSize: "13px" }}>
                                                    <label><b>Auction Id :</b> {renderString(auction.auction_id)}</label>
                                                </Col>
                                                <Col md={4} style={{ fontSize: "13px", textAlign: 'right' }}>
                                                    <label ><b>Lead Id :</b> {renderString(auction.lead_id)} </label>
                                                </Col>
                                            </Row>
                                            <Row style={{ justifyContent: 'space-between' }}>
                                                <Col md={8} style={{ fontSize: "13px" }}>
                                                    <label><b>Started By :</b> {renderString(auction.userName)}</label>
                                                </Col>
                                                <Col md={2}>
                                                    <Chip className="custombtn2 float-right" label={renderString(auction.type)} style={{ backgroundColor: '#674DD0', borderRadius: '3px',fontWeight: '500' }} />
                                                </Col>
                                            </Row>
                                            <Row style={{ justifyContent: 'space-between' }}>
                                                <Col md={8} style={{ fontSize: "13px" }}>
                                                    <label><b>Started at :</b> {getDate(auction.startTime)}  </label>
                                                </Col>
                                                <Col md={4}  >
                                                    <Chip className="float-right" label={renderString(auction.status)} style={{ backgroundColor: '#55B7EF', borderRadius: '3px', fontWeight: '500',color:'white',height:'20px',fontSize:'0.7rem' }} />
                                                </Col>
                                            </Row>

                                            <Table size="small" >
                                                <TableHead style={{ backgroundColor: "#CEE1F2" }}>
                                                    <TableRow>
                                                        {
                                                            ['Date', 'Amount', 'Dealer', 'Store Name'].map(value => (
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
                                                    { auction.bidderInfo.map((bidInfo,rowNum) => (
                                                        <TableRow key={rowNum} tabIndex={-1} style={{ backgroundColor: '#F3F3F3' }}> 
                                                        <TableCell>
                                                            {(bidInfo && bidInfo.bidderTime && getDate(bidInfo.bidderTime)) ? getDate(bidInfo.bidderTime) : '-'}
                                                        </TableCell>
                                                        <TableCell style={{display:'flex',flexWrap:'nowrap'}}>
                                                                <p>{index === 0 && <img src={edit} onClick={()=> openEditDialog(bidInfo.value,rowNum)} 
                                                                style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt="edit" />}
                                                                {(bidInfo && bidInfo.value) ? getAmount(bidInfo.value) : '-'}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                                <p>{index === 0 && <img src={WhiteCallIcon} onClick={() => callToBidder(rowNum)} 
                                                                style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }}alt='CallIcon' />}
                                                                {(bidInfo && bidInfo.bidderName) ? renderString(bidInfo.bidderName) : '-'}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            {(bidInfo && bidInfo.storeName) ? renderString(bidInfo.storeName) : '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
            ))
        }
    </div>: 
        <Typography variant='h6'>No data Available</Typography>    
    }
        
        </>
        )
}

