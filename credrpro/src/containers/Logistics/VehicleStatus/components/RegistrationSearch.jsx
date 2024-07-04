import React, { useState } from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../../shared/components/form/Search'
import { DownloadIcon } from '../../../../core/utility/iconHelper'
import Checkbox from '@material-ui/core/Checkbox'

const RegistrationSearch = ({ onInput, onSearch, value, onClearSearch, onExportFile }) => {

  const [universalCheck, setUniversalCheck] = useState(false)

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
      <Card className="mt-3 mb-3" style={{ paddingBottom: 0 }}>
        <CardBody className="card-shadow square-border" style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            color="primary"
            checked={universalCheck}
            onChange={(e) => handleChange(e)}
          />
          <p style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold', marginRight: 20, marginBottom: 9 }}>Include Old Records</p>
          <SearchField
            value={value}
            onSearch={onInput}
            withButton
            onEnter={() => searchRegNumber(value, universalCheck)}
            onClick={() => searchRegNumber(value, universalCheck)}
            onClearInput={clearCheckedInput}
            placeholder="Search By Registration Number"
            style={{ maxWidth: 250 }}
          />
          {/* <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={onExportFile}>
        <img src={DownloadIcon} className="btn-icon" alt="Download" />
        Download Data
      </button> */}
        </CardBody>
      </Card>
    </>
  )
}

export default RegistrationSearch