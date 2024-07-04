import React from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../../shared/components/form/Search'
import { DownloadIcon } from '../../../../core/utility/iconHelper'

const RegistrationSearch = ({ onInput, onSearch, value, onClearSearch, onExportFile }) => (
  <Card className="mt-3 mb-3" style={{ paddingBottom: 0 }}>
    <CardBody className="card-shadow square-border" style={{ display: 'flex', alignItems: 'center' }}>
      <p style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold', marginRight: 20 }}>Search By Keywords</p>
      <SearchField
        value={value}
        onSearch={onInput}
        withButton
        onEnter={onSearch}
        onClick={onSearch}
        onClearInput={onClearSearch}
        placeholder="Search By Registration Number"
        style={{ maxWidth: 250 }}
      />
      <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={onExportFile}>
        <img src={DownloadIcon} className="btn-icon" alt="Download" />
        Download Data
      </button>
    </CardBody>
  </Card>
)

export default RegistrationSearch