import React, { Fragment } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { renderString, getDate, getAmount, getStatus } from '../../../core/utility'

const BiddingDetails = ({ bidders, biddingDetail, status }) => (
  <Fragment>
    <h1 className="tab-heading">Bidding Details</h1>
    <div className="table-wraper marginTop" style={{ marginBottom: 40 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              Date and Time
            </TableCell>
            <TableCell>
              Amount
            </TableCell>
            <TableCell>
              Dealer Name
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            bidders && bidders.length ? bidders.map(bidder => (
              <TableRow key={bidder.bidderTime}>
                <TableCell>
                  {getDate(bidder.bidderTime)}
                </TableCell>
                <TableCell>
                  {getAmount(bidder.value)}
                </TableCell>
                <TableCell>
                  {renderString(bidder.bidderName)}
                </TableCell>
              </TableRow>
            )) :
              <TableRow>
                <TableCell>
                  NA
                </TableCell>
                <TableCell>
                  NA
                </TableCell>
                <TableCell>
                  NA
                </TableCell>
              </TableRow>
          }
        </TableBody>
      </Table>
    </div>
    <div className="data-row">
      <p className="title">Total&nbsp;Number&nbsp;of&nbsp;Bids</p>
      <p className="data">{renderString(bidders && bidders.length)}</p>
    </div>
    <div className="data-row">
      <p className="title">Highest&nbsp;Bid</p>
      <p className="data">{getAmount(biddingDetail.highestBid)}</p>
    </div>
    <div className="data-row">
      <p className="title">Highest&nbsp;Bid&nbsp;Dealer</p>
      <p className="data">{renderString(biddingDetail.highestBidderName)}</p>
    </div>
    <div className="data-row">
      <p className="title">Bidding&nbsp;Status</p>
      <p className="data">{getStatus(status)}</p>
    </div>
  </Fragment>
)

export default BiddingDetails