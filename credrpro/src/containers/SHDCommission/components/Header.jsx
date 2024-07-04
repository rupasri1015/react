import React, { useState } from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../shared/components/form/Search'

const CommissionHeader = ({ status, onChangeStatus, onSearch, onClearSearch }) => {

    const [searchText, setSearchText] = useState('')

    const getClassName = (currentStatus) => {
        return status.toLowerCase() === currentStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
    }

    const handleSearch = () => {
        if(searchText){
            onSearch(searchText)
        }
    }

    const handleClearSearch = () => {
        setSearchText('')
        onClearSearch()
    }

    return (
        <Card className="pending-inventory-header">
            <CardBody className="card-shadow square-border">
                <div className='row'>
                    <div className='col-sm-6'>
                        <button className={getClassName('LIVE')} onClick={() => onChangeStatus('LIVE')}>{`Live`}</button>
                        <button className={getClassName('PENDING CUSTOMER')} onClick={() => onChangeStatus('PENDING CUSTOMER')}>{`Pending Customer`}</button>
                        <button className={getClassName('COMPLETED')} onClick={() => onChangeStatus('COMPLETED')}>{`Completed`}</button>
                    </div>
                    <div className='col-sm-6'>
                        <SearchField
                            value={searchText}
                            onSearch={searchTextValue => setSearchText(searchTextValue)}
                            withButton
                            onEnter={handleSearch}
                            onClick={handleSearch}
                            onClearInput={handleClearSearch}
                            placeholder="Search By LeadId, Vehicle Number, SHD Name"
                            style={{ maxWidth: 500 }}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default CommissionHeader