import React, {useState} from 'react'
import { Card, CardBody } from 'reactstrap'
import { useSelector } from 'react-redux'
import SearchField from '../../../shared/components/form/Search'
import { DownloadIcon } from '../../../core/utility/iconHelper'
import Checkbox from '@material-ui/core/Checkbox'

const PaperTransferHeader = ({ ptStatus, onQcStatusUpdate, onSearch, onSearchType, searchText, onClearSearch, onExportFile }) => {

  console.log("ptStatus", ptStatus)

  const [universalCheck, setUniversalCheck] = useState(false)

  const collectedCount = useSelector(state => state.paperTransferData.collectedCount)
  const receivedCount = useSelector(state => state.paperTransferData.receivedCount)
  const rtoCount = useSelector(state => state.paperTransferData.rtoCount)
  const vahanCount = useSelector(state => state.paperTransferData.vahanCount)
  const total = useSelector(state => state.paperTransferData.count)
  const deliveredCount = useSelector(state => state.paperTransferData.deliveredCount)
  const ticketCount = useSelector(state => state.paperTransferData.ticketCount)
  const pendingCount = useSelector(state => state.paperTransferData.pendingCount)
  
  const getClassName = (tabStatus) => {
    return ptStatus.toLowerCase() === tabStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }

  const handleChange = (e) => {
    setUniversalCheck(e.target.checked)
  }

  const searchRegNumber = (a,b) => {
    onSearch(a,b)
  }
  
  const clearCheckedInput = () => {
    onClearSearch(setUniversalCheck(false))
  }

  return (
    <>
      <Card className="pending-inventory-header mt-3">
        <CardBody className="card-shadow square-border">
          <button className={getClassName('PENDING')} onClick={() => onQcStatusUpdate('PENDING', universalCheck)}>{`Pending (${pendingCount})`}</button>
          <button className={getClassName('COLLECTED')} onClick={() => onQcStatusUpdate('COLLECTED', universalCheck)}>{`Collected (${collectedCount})`}</button>
          <button className={getClassName('RTO_SUBMITTED')} onClick={() => onQcStatusUpdate('RTO_SUBMITTED', universalCheck)}>{`Submitted to RTO (${rtoCount})`}</button>
          <button className={getClassName('VAAHAN_APPROVED')} onClick={() => onQcStatusUpdate('VAAHAN_APPROVED', universalCheck)}>{`Approved by Vaahan (${vahanCount})`}</button>
          <button className={getClassName('RECEIVED')} onClick={() => onQcStatusUpdate('RECEIVED', universalCheck)}>{`Received (${receivedCount})`}</button>
          <button className={getClassName('DELIVERED')} onClick={() => onQcStatusUpdate('DELIVERED', universalCheck)}>{`Delivered (${deliveredCount})`}</button>
          {/* <button className={getClassName('TICKET_RAISED')} onClick={() => onQcStatusUpdate('TICKET_RAISED', universalCheck)}>{`Ticket raised (${ticketCount})`}</button> */}
        </CardBody>
      </Card>
      <Card  className="mt-3 mb-3" style={{ paddingBottom: 0 }}>
        <CardBody className="card-shadow square-border" style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            color="primary"
            checked={universalCheck}
            onChange={(e) => handleChange(e)}
          />
          <p style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold', marginRight: 20, marginBottom: 9 }}>Include Old Records</p>
          <SearchField
            value={searchText}
            onSearch={onSearchType}
            withButton
            onEnter={() => searchRegNumber(searchText, universalCheck)}
            onClick={() => searchRegNumber(searchText, universalCheck)}
            onClearInput={clearCheckedInput}
            placeholder="Search By Registration Number"
            //className="float-right"
            style={{ maxWidth: 350 }}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default PaperTransferHeader