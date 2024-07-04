import React from 'react'

const DocumentQcTabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`vertical-tabpanel-${index}`}
    aria-labelledby={`vertical-tab-${index}`}
    style={{ width: "100%", padding: '0 10px', marginTop: 10, backgroundColor: '#F4F7FD' }}
    {...other}
  >
    {children}
  </div>
)

export default DocumentQcTabPanel