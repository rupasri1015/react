import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import { getDate, renderString } from '../../../core/utility'
import AudioPlayer from 'material-ui-audio-player';
import { makeStyles } from '@material-ui/core/styles';
import './audiorecord.scss'
import NoResultFound from '../../../shared/components/NoResultFound'

const rows = [
    { id: 'date', label: 'Date' },
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status', },
    { id: 'callduration', label: 'Call Duration' },
    { id: 'callstatus', label: 'Call Status' },
    { id: 'remarks', label: 'Remarks' },
    { id: 'audio', label: 'Play Audio' }
]

const useStyles = makeStyles((theme) => {
    return {
        root: {
            [theme.breakpoints.down('xs')]: {
                width: '40px',
            },
        },
        loopIcon: {
            color: '#3f51b5',
            '&.selected': {
                color: '#0921a9',
            },
            '&:hover': {
                color: '#7986cb',
            },
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        playIcon: {
            color: '#f50057',
            '&:hover': {
                color: '#ff4081',
            },
        },
        replayIcon: {
            color: '#e6e600',
        },
        pauseIcon: {
            color: '#0099ff',
        },
        volumeIcon: {
            color: 'rgba(0, 0, 0, 0.54)',
        },
        volumeSlider: {
            color: 'black',
        },
        progressTime: {
            color: 'rgba(0, 0, 0, 0.54)',
        },
        mainSlider: {
            color: '#3f51b5',
            '& .MuiSlider-rail': {
                color: '#7986cb',
            },
            '& .MuiSlider-track': {
                color: '#3f51b5',
            },
            '& .MuiSlider-thumb': {
                color: '#303f9f',
            },
        },
    };
});

class AuditTable extends Component {

    render() {
        const { openRecord, onClose, callRecordings } = this.props
        return (
            <>
                <Dialog open={openRecord} onClose={onClose} disableEscapeKeyDown maxWidth="lg">
                    <DialogTitle>Status History<span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
                    <div className="table-wraper">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {
                                        rows.map(row => (
                                            <TableCell key={row.id}>
                                                {row.label}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            {
                                Boolean(callRecordings.length) ?
                                    <TableBody>
                                        {
                                            callRecordings.map((data, index) => {
                                                return (
                                                    <TableRow hover tabIndex={-1} key={`${data.auctionTransactionId}${index}`}>
                                                        <TableCell>
                                                            {getDate(data.createdDate)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.csAgentName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.callStatus}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.duration}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.callStatus}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.remarks}
                                                        </TableCell>
                                                        <TableCell>
                                                            {/* <ThemeProvider theme={muiTheme}> */}
                                                            <div className="auditRecord">
                                                                <AudioPlayer
                                                                    src={data.url}
                                                                    elevation={2}
                                                                    width="245px"
                                                                    useStyles={useStyles}
                                                                />
                                                            </div>
                                                            {/* </ThemeProvider>; */}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody> :
                                    <div className='ml-6'>
                                        <h3 >No Records Found</h3>
                                    </div>
                            }
                        </Table>
                        <div className="doc-image-container">
                            <button className="btn-outline blue selected float-right ml-5 mt-3 mb-3 mr-3" onClick={onClose} >Close</button>
                        </div>
                    </div>
                </Dialog>
            </>
        )
    }
}

export default AuditTable