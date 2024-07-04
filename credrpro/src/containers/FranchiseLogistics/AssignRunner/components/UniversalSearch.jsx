import React from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../../shared/components/form/Search'

const UniversalSearch = ({ onInput, onSearch, value, onClearSearch }) => (
  <Card className="mt-3" style={{ paddingBottom: 0 }}>
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
        style={{ maxWidth: 450 }}
      />
    </CardBody>
  </Card>
)

export default UniversalSearch