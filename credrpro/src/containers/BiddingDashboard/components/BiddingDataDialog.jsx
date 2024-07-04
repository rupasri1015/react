import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import { renderString } from '../../../core/utility'
import { Row, Col } from 'reactstrap'
import { getAmount, getDate } from '../../../core/utility/stringUtility'
import Chip from '@material-ui/core/Chip';
import { getMobile, getRole, getUserID, getUserName } from '../../../core/services/rbacServices'
import { CallIcon, WhiteCallIcon } from '../../../core/utility/iconHelper'
import { callToCustomer } from '../../../core/services/biddingServices'
import { useState } from 'react'
import edit from '../../../shared/img/icons/edit-icon.svg'
import cancel from '../../../shared/img/icons/close-icon.svg'
import MuiAlert from '@material-ui/lab/Alert';
import { updateBidAmt } from '../../../core/services/biddingServices'
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch } from "react-redux"
import { setNotification } from '../../../redux/actions/notificationAction'
import Slide from '@material-ui/core/Slide';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}
const statuscolor = {
  AUCTION_COMPLETED: "#FF8C00",
  EXCHANGE: "#800080",
  FOLLOWUP: "#FFA500",
  DROPPED: "#E41B17",
  SELL: "green",
  ONGOING: "#7FFD4",
  REAUCTION_RESTARTED: "#FFC0CB",
  REAUCTION_STARTED: "#FFC0CB",
  AUCTION_STARTED: "#C32148"
}
const BiddingDataDialog = ({ isOpen, onClose, onGoToSummary, status, title, check, columns, data, cta, isArray, handleCallModel, refreshData, onRefreshPage }) => {
  const handleCall = (leadId, number, billerName) => {
    let payload = {}
    payload.leadId = leadId
    payload.leadCustNumber = number
    payload.leadCustName = billerName
    handleCallModel(payload)
  }
  const [bidIds, setBidIds] = useState("")
  const [amt, setAmt] = useState("")
  const [leadId, setLeadId] = useState("")
  const [actionId, setActionId] = useState("")
  const [bidderUserId, setBidderUserId] = useState("")

  const [showDialoge, setShowDialoge] = useState(false)
  const [comfirm, setComfirm] = useState(false)
  const [isError, setIsError] = useState(false)
  const [erroMgs, setErrorMgs] = useState(false)
  const [color, setColor] = useState("")
  const dispatch = useDispatch()
  const handleEditPrice = (id, amt) => {
    if (bidIds !== id) {
      setBidIds(id)
      setAmt(amt)
    }
  }

  const updatePrice = (e, leadId, actionId, preAmt, bidderUserId) => {
    if (e.key === 'Enter') {
      // if (Number(amt) > Number(preAmt)) {
        setShowDialoge(true)
        setActionId(actionId)
        setLeadId(leadId)
        setBidderUserId(bidderUserId)
        setIsError(false)
      // }
      // else {
      //   setIsError(true)
      // }

    }
  }
  const handleUpdatePrice = () => {
    let payload = {}
    payload.bidId = bidIds
    payload.bidderLeadId = leadId
    payload.value = amt
    payload.bidderUserId = bidderUserId
    payload.loginUserId = getUserID()
    updateBidAmt(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          setErrorMgs(apiResponse.message)
          setColor("success")
          setIsError(true)
          
          setBidIds('')
          setComfirm(false)
          setAmt("")
          setLeadId('')
          setShowDialoge(false)
          refreshData(actionId)
          onRefreshPage()
          
          // dispatch(setNotification(
          //   'success',
          //   'Success',
          //   apiResponse.message
          // ))
        }
        else {
          setErrorMgs(apiResponse.message)
          setColor("error")
          setIsError(true)
          
          // dispatch(setNotification(
          //   'danger',
          //   'Error',
          //   apiResponse.message
          // ))
        }


      })
  }
  return (
    <div>
      {
        isError &&
      //   <Snackbar
      //   open={isError}
      //   onClose={() => setIsError(false)}
      //   autoHideDuration={6000}
      //   TransitionComponent={TransitionDown}
      //   message={ <Alert severity="error">{erroMgs}</Alert>}
      //   // key={transition ? transition.name : ''}
      // />
        <Snackbar open={isError} autoHideDuration={3000} onClose={() => setIsError(false)} anchorOrigin={{  vertical: 'top',horizontal: 'center',}}>
          <Alert severity={color}>{erroMgs}</Alert>
        </Snackbar>
      }
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {title} <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
        </DialogTitle>
        {
          check == "bidding" &&
          <DialogContent>
            {
              data && data[0].acutionList.map((row, index) => (
                <>
                  <div className="table-wraper" style={{ paddingBottom: "30px" }}>
                    <div className="row">
                      <div className="col">
                        {
                          <>
                            <Row>
                              <Col md={4} style={{ fontSize: "13px" }}>
                                <label><b>Started By :</b> {row.userName}</label>
                              </Col>
                              {/* <Col md={6} style={{ fontSize: "13px" }}> */}
                              {/* <Row> */}
                              <Col md={4} style={{ fontSize: "13px" }}>
                                <label><b>Auction Id :</b> {row.auction_id}</label>
                              </Col>
                              <Col md={4} style={{ fontSize: "13px" }}>
                                <label ><b>Lead Id :</b> {row.lead_id} </label>
                              </Col>

                              {/* </Row> */}
                              {/* </Col> */}

                            </Row>
                            <Row>
                              <Col md={6} style={{ fontSize: "10px" }}>
                                <label><b>Started at :</b>  <span style={{ color: "#2952E5" }}>{getDate(row.startTime)}</span></label>
                              </Col>
                              {/* <Col md={3} style={{ fontSize: "10px" }}>
                         
                            <label><b>Ended at:</b><p style={{color:"#D92128"}}> {getDate(row.endTime)}</p></label>
                          </Col> */}
                              <Col md={2}>
                                <Chip className="custombtn1 float-right" label={row.type} style={row.type == "STORE" ? { backgroundColor: '#021058' } : { backgroundColor: "#9172EC" }} />
                              </Col>
                              <Col md={4}>
                                <Chip className="custombtn2 float-right" label={row.status} style={{ backgroundColor: statuscolor[row.status] }} />
                              </Col>
                            </Row>

                            <Table size="small" >
                              <TableHead style={{ backgroundColor: "#F4F7FD" }}>
                                <TableRow>
                                  {
                                    columns.map(column => (
                                      <TableCell
                                        key={column.id}
                                      >
                                        {column.label}
                                      </TableCell>
                                    ))
                                  }
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {
                                  isArray ?
                                    row.bidderInfo.map((record, recordindex) => (
                                      index === data[0].acutionList.length - 1 && status === "AUCTION_COMPLETED" ?
                                        <TableRow tabIndex={-1} key={recordindex}>
                                          {
                                            columns.map((column, index) => (
                                              <TableCell
                                                key={index}
                                              >

                                                {
                                                  record[column.id] === 0 ? '0' :
                                                    (column.id === "value" ? bidIds === record.bidId ? <><input style={{ width: "90px", marginRight: "10px" }} type="text" value={amt} onChange={(e) => /^[\.0-9]*$/.test(e.target.value) && setAmt(e.target.value)} onKeyDown={(e) => updatePrice(e, record.bidderLeadId, row.auction_id, record.value, record.bidderUserId)} /><img src={cancel} onClick={() => setBidIds("")} style={{ width: '15px', marginRight: '5px', cursor: 'pointer' }} /></> :
                                                      <p>  {record[column.id] ? <><span>{record[column.id]} </span><img src={edit} onClick={() => handleEditPrice(record.bidId, record.value)} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt="edit" /></> : getAmount(record[column.id])}</p>

                                                      : (column.id === "bidderTime" ? getDate(record[column.id]) : column.id === "storeName" && getRole() === "PRO_BID" ? "--" : column.id === "bidderName" ? <p>{renderString(record[column.id]) + " "}{record["bidderNumber"] && getRole() === "SHD_COMMISSION" ? <img src={WhiteCallIcon} onClick={() => handleCall(row.lead_id, record["bidderNumber"], record["bidderName"])} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt='CallIcon' /> : ""}</p>
                                                        : renderString(record[column.id])))
                                                }

                                              </TableCell>
                                            ))
                                          }
                                        </TableRow>
                                        :
                                        <TableRow tabIndex={-1} key={recordindex}>
                                          {
                                            columns.map(column => (
                                              <TableCell
                                                key={column.id}
                                              >
                                                {
                                                  record[column.id] === 0 ? '0' :
                                                    (column.id === "value" ? getAmount(record[column.id]) : (column.id === "bidderTime" ? getDate(record[column.id]) : column.id === "storeName" && getRole() === "PRO_BID" ? "--" : column.id === "bidderName" ? <p>{renderString(record[column.id]) + " "}{record["bidderNumber"] && getRole() === "SHD_COMMISSION" ? <img src={WhiteCallIcon} onClick={() => handleCall(row.lead_id, record["bidderNumber"], record["bidderName"])} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt='CallIcon' /> : ""}</p>
                                                      : renderString(record[column.id])))}

                                              </TableCell>
                                            ))
                                          }
                                        </TableRow>
                                    )) :
                                    index === data[0].acutionList.length - 1 && status === "AUCTION_COMPLETED"
                                      ?
                                      <TableRow tabIndex={-1}>
                                        {
                                          columns.map(column => (
                                            <TableCell
                                              key={column.id}
                                            >
                                              {
                                                data[column.id] === 0 ? '0' :
                                                  (column.id === "value" ? bidIds === data.bidId ? <><input style={{ width: "90px", marginRight: "10px" }} type="text" value={amt} onChange={(e) => /^[\.0-9]*$/.test(e.target.value) && setAmt(e.target.value)} onKeyDown={(e) => updatePrice(e, data.bidderLeadId, row.auction_id, data.value, data.bidderUserId)} /><img src={cancel} onClick={() => setBidIds("")} style={{ width: '15px', marginRight: '5px', cursor: 'pointer' }} /></> :
                                                    <p>  {data[column.id] ? <><span>{data[column.id]} </span><img src={edit} onClick={() => handleEditPrice(data.bidId, data.value)} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt="edit" /></> : getAmount(data[column.id])}</p>

                                                    : (column.id === "bidderTime" ? getDate(data[column.id]) : column.id === "storeName" && getRole() === "PRO_BID" ? "--" : column.id === "bidderName" ? <p>{renderString(data[column.id]) + " "}{data["bidderNumber"] && getRole() === "SHD_COMMISSION" ? <img src={WhiteCallIcon} onClick={() => handleCall(row.lead_id, data["bidderNumber"], data["bidderName"])} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt='CallIcon' /> : ""}</p>
                                                      : renderString(data[column.id])))
                                              }

                                            </TableCell>
                                          ))
                                        }

                                      </TableRow>
                                      :
                                      <TableRow tabIndex={-1}>
                                        {
                                          columns.map(column => (
                                            <TableCell
                                              key={column.id}
                                            >
                                              {
                                                data[column.id] === 0 ? '0' :
                                                  (column.id === "value" ? getAmount(data[column.id]) : (column.id === "bidderTime" ? getDate(data[column.id]) : column.id === "storeName" && getRole() === "PRO_BID" ? "--" : column.id === "bidderName" ? <p>{renderString(data[column.id]) + " "}{data["bidderNumber"] && getRole() === "SHD_COMMISSION" ? <img src={WhiteCallIcon} onClick={() => handleCall(row.lead_id, data["bidderNumber"], data["bidderName"])} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt='CallIcon' /> : ""}</p>
                                                    : renderString(data[column.id])))}

                                            </TableCell>
                                          ))
                                        }
                                      </TableRow>
                                }
                              </TableBody>
                            </Table>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                </>
              ))
            }
          </DialogContent>
        }
        {
          check != "bidding" &&
          <DialogContent>
            <div className="table-wraper">
              <Table size="small">
                <TableHead style={{ backgroundColor: "#F4F7FD" }}>
                  <TableRow>
                    {
                      columns.map(column => (
                        <TableCell
                          key={column.id}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    isArray ?
                      data.map((record, recordindex) => (
                        <TableRow tabIndex={-1} key={recordindex}>
                          {
                            columns.map((column, index) => (
                              <TableCell
                                key={index}
                              >
                                {
                                  record[column.id] === 0 ? '0' :
                                    renderString(record[column.id])
                                }
                              </TableCell>
                            ))
                          }
                        </TableRow>
                      )) :
                      <TableRow tabIndex={-1}>
                        {
                          columns.map(column => (
                            <TableCell
                              key={column.id}
                            >
                              {
                                data[column.id] === 0 ? '0' :
                                  renderString(data[column.id])
                              }

                            </TableCell>
                          ))
                        }
                      </TableRow>
                  }
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        }

        <DialogActions>
          <button className="icon-btn" onClick={() => { cta === 'Close' ? onClose() : onGoToSummary(data.leadId) }}>{cta}</button>
        </DialogActions>
      </Dialog>
      {
        showDialoge &&
        <Dialog
          open={showDialoge}
          onClose={() => setShowDialoge(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <h4>Are you Sure to Update the Price ?</h4>
          </DialogTitle>
          <DialogContent>
            <p style={{ fontSize: "14px" }}>{getAmount(amt)}</p>
          </DialogContent>
          <DialogActions>
            <button className="icon-btn gray" onClick={() => setShowDialoge(false)}>Cancel</button>
            <button className="icon-btn" onClick={handleUpdatePrice} >Confirm</button>
          </DialogActions>
        </Dialog>
      }
    </div>


  )
}
export default BiddingDataDialog