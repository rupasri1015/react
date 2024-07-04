import React from 'react'
import { DownloadIcon } from '../../core/utility/iconHelper'

const ExportToExcel = ({ onExportData }) => (
  <button className="icon-btn float-right" onClick={onExportData} >
    <img src={DownloadIcon} className="btn-icon" alt="Download" />
    Export Data
  </button>
)

export default ExportToExcel