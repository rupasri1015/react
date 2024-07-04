import React from 'react'
import './Error.scss'
import SearchField from '../../../shared/components/Search'

export default function Header ({ onChangeStatus, status, searchText, onSearch, onClearSearch, onSearchOfKeyword }) {
  
  const getClassName = (currentStatus) => {
    return status.toLowerCase() === currentStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }

  return (
    <div className="cpp-filter-container">
        <button style={{ marginTop: '10px', marginBottom: '10px' }} className={getClassName('UNASSIGNED')} onClick={() => onChangeStatus('UNASSIGNED')}> {`Un-Assigned`} </button>
        <button style={{ marginTop: '10px', marginBottom: '10px' }} className={getClassName('PENDING')} onClick={() => onChangeStatus('PENDING')}>{`Pending`}</button>
        <button style={{ marginTop: '10px', marginBottom: '10px' }} className={getClassName('FOLLOWUP')} onClick={() => onChangeStatus('FOLLOWUP')}>{`Follow Up`}</button>
        <button style={{ marginTop: '10px', marginBottom: '10px' }} className={getClassName('DROP')} onClick={() => onChangeStatus('DROP')}> {`Dropped`} </button>
        <button style={{ marginTop: '10px', marginBottom: '10px' }} className={getClassName('SOLD')} onClick={() => onChangeStatus('SOLD')}> {`Sold`} </button>
        <SearchField 
          style={{ marginTop: '10px', marginBottom: '10px' }}
          placeholder="Search By Lead ID, Registration Number"
          searchText={searchText}
          onSearch={onSearch}
          onEnter={onSearchOfKeyword}
          onClearSearch={onClearSearch}
          onSearchKeyword={onSearchOfKeyword}
      />
    </div>
  )
}
