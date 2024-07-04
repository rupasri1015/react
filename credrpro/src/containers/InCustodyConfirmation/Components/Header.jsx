import React, { useState } from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../shared/components/form/Search'

const Header = ({ status, onStatusClick, onSearch, onClearSearch }) => {

    const [searchText, setSearchText] = useState('')

    const getClassName = (currentStatus) => {
        return status.toLowerCase() === currentStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
    }

    const handleSearch = () => {
        if(searchText){
            onSearch(searchText,status)
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
                        <button className={getClassName('PENDING')} onClick={() => onStatusClick(`PENDING`)}>{`Pending`}</button>
                        <button className={getClassName('COMPLETED')} onClick={() => onStatusClick(`COMPLETED`)}>{`Completed`}</button>
                    </div>
                    <div className='col-sm-6'>
                        <SearchField
                            value={searchText}
                            onSearch={searchTextValue => setSearchText(searchTextValue)}
                            withButton
                            onEnter={handleSearch}
                            onClick={handleSearch}
                            onClearInput={handleClearSearch}
                            placeholder="Search By LeadId / Vehicle Number"
                            style={{ maxWidth: 400 }}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default Header