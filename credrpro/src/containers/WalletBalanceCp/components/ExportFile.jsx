
import { Divider } from '@material-ui/core'
import React, { useState } from 'react'
import './exportFile.scss'
import { ExportToExcel } from '../../../core/utility/iconHelper'
import { useDetectClickOutside } from 'react-detect-click-outside';

export default function ExportFile({
    exportFile
}) {

    const [showOptions, setShowOptions] = useState(false)
    const closeOption = () => {
        setShowOptions(false)
    }
    const refOutside = useDetectClickOutside({ onTriggered: closeOption })

    const exportHandler = (type) => {
        exportFile(type)
    }
    return (
        <div style={{
            display: "flex",
            justifyContent: 'flex-end',
            marginRight: '15px'

        }}>
            <div className='exportFileContainer' 
            ref={refOutside}
             onClick={() => setShowOptions(!showOptions)} style={{ cursor: 'pointer', position: 'relative', marginBottom:'10px'}}>
                <div style={{}}>
                <img
                    className="exportLedger"
                    src={ExportToExcel}
                    alt="X"
                    style={{ height: '14px', width:'14px', marginRight:'5px' }}
                />
                <span style={{ fontSize: '15px', width:'200px', borderBottom: '1px solid black'}}> Export to excel </span>

</div>



                {showOptions && <div className='showOption'>
                    <div onClick={() => exportHandler('all')}>All Records</div>
                    <Divider />
                    <div onClick={() => exportHandler('outstanding')}>Outstanding Records</div>
                </div>}
            </div>
        </div >
    )
}