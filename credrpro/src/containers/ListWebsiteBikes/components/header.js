import { set } from 'lodash'
import React from 'react'

const ListBikesHeader = ({ status, onChangeStatus, previewPayload, setPreviewStatus }) => {

  const getClassName = (tabStatus) => {
    return tabStatus.toLowerCase() === status.toLowerCase() ? 'btn-outline blue mt-2 mb-2 selected' : 'btn-outline blue mt-2 mb-2'
  }

  const handleChangeStatus = (stats) => {
    if (setPreviewStatus && status === 'PREVIEW') {
      if (stats !== 'PREVIEW') {
        let a = window.confirm('Your changes are Not saved. Are you sure you want to go back?')
        if (a) onChangeStatus(stats)
        else console.log('check')
      }
    }
    else onChangeStatus(stats)
  }

  return (
    <div className='mt-5'>
      <p style={{ fontSize: '20px', marginBottom: '10px' }}>Select Category</p>
      <button className={getClassName('city')} onClick={() => handleChangeStatus('CITY')}>City</button>
      <button className={getClassName('cityStore')} onClick={() => handleChangeStatus('CITYSTORE')}>City + Store</button>
      <button className={getClassName('cityStoreModel')} onClick={() => handleChangeStatus('CITYSTOREMODEL')}>City + Store + Model</button>
      <button className={getClassName('cityModel')} onClick={() => handleChangeStatus('CITYMODEL')}>City + Model</button>
      <button className={getClassName('listView')} onClick={() => handleChangeStatus('LISTVIEW')}>List View</button>
      {
        previewPayload && <button className={getClassName('preview')} onClick={() => handleChangeStatus('PREVIEW')}>Preview</button>
      }
    </div>
  )
}

export default ListBikesHeader