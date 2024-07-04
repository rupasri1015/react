import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getAmount } from '../../../core/utility';
import Close from '@material-ui/icons/Close';
import { Checkbox, Divider } from '@material-ui/core';
import Button from 'reactstrap/lib/Button';
import { updateRefubCost } from '../../../core/services/refurbServices';
import { setNotification } from '../../../redux/actions/notificationAction'
import { connect } from 'react-redux'
import Slide from '@material-ui/core/Slide';
import './style.scss'
import PaginatedThumbnails from 'react-images-viewer/lib/components/PaginatedThumbnails';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
class inspectionDialog extends Component {
    state = {
        aoAmt: this.props.data.aoAmt,
        foAmt: this.props.data.foAmt,
        categoryId: [],
        FOcolor: "#F0F0F0",
        FOopacity: "50%",
        AOcolor: "#F0F0F0",
        AOopacity: "50%",
        wiRefurbCost: Number(this.props.data.wiRefurbCost)
    }
    setAoAmt = (checked, val, cId) => {
        const { wiRefurbCost } = this.state
        if (!checked) {
            this.setState({ wiRefurbCost: wiRefurbCost - Number(val) })
            this.setState({ categoryId: [...this.state.categoryId, cId] })
            this.setState({ AOcolor: "#F0F0F0" })
            this.setState({ AOopacity: "50%" })
        }
        else {
            this.setState({ wiRefurbCost: wiRefurbCost + Number(val) })
            const update = this.state.categoryId && this.state.categoryId.filter((id) => id !== cId)
            this.setState({ categoryId: update })
            this.setState({ AOcolor: "white" })
            this.setState({ AOopacity: "100%" })
        }
    }
    setFoAmt = (checked, val, cId) => {
        const { wiRefurbCost } = this.state
        if (!checked) {
            this.setState({ wiRefurbCost: wiRefurbCost - Number(val) })
            this.setState({ categoryId: [...this.state.categoryId, cId] })
            this.setState({ FOcolor: "#F0F0F0" })
            this.setState({ FOopacity: "50%" })
        }
        else {
            this.setState({ wiRefurbCost: wiRefurbCost + Number(val) })
            const update = this.state.categoryId && this.state.categoryId.filter((id) => id !== cId)
            this.setState({ categoryId: update })
            this.setState({ FOcolor: "white" })
            this.setState({ FOopacity: "100%" })
        }

    }
    getWarehouseAmt = () => {
        const { data } = this.props
        const { aoAmt, foAmt } = this.state
        const total = Number(data.wiRefurbCost) - Number(aoAmt) - Number(foAmt)
        return total
    }
    componentDidMount() {
        const { data } = this.props
        const {categoryId}=this.state
        data.refurbInspectionList && data.refurbInspectionList.length &&
            data.refurbInspectionList.map((item) => {
                if(item.keptStatus === "DROPPED")
                {
                    categoryId.push(item.categoryId)
                }
            })
    }
    submitRefubCost = () => {
        const { data, rmId, dispatch, onClose } = this.props
        const { aoAmt, foAmt, categoryId, wiRefurbCost } = this.state
        let payload = {}
        payload.aoAmt = aoAmt
        payload.foAmt = foAmt
        payload.refurbAmt = wiRefurbCost
        payload.rmId = rmId
        payload.categoryId = categoryId
        updateRefubCost(payload)
            .then(urlResponse => {
                if (urlResponse.isValid) {
                    onClose()
                    dispatch(setNotification(
                        'success',
                        'Submitted',
                        urlResponse.message
                    ))
                }
                else {
                    dispatch(setNotification(
                        'danger',
                        'Error',
                        urlResponse.message
                    ))
                }

            })
    }
    render() {
        const { open, onClose, data, status } = this.props
        const { AOcolor, AOopacity, FOcolor, FOopacity, wiRefurbCost } = this.state
        return (
            <div >
                <div id="inDiv">
                    <Dialog open={open}
                        scroll="paper"
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                        fullWidth
                        onClose={onClose}
                        fullScreen
                        TransitionComponent={Transition}
                    >
                        <DialogTitle id="scroll-dialog-title" style={{ paddingBottom: "0px" }}><span style={{ marginLeft: "25px", fontWeight: "bold" }}>Inspected Details</span><Button className="float-right" style={{ marginRight: "25px" }} color="danger" onClick={onClose}>Close</Button>{status === 'QC Completed' && data.refurbInspectionList && data.refurbInspectionList.length  ? <Button className="float-right" style={{ marginRight: "25px" }} color="success" onClick={this.submitRefubCost}>Submit</Button>:""}</DialogTitle>
                        <DialogContent style={{ border: "2px solid #F0F0F0" }} >
                            <table class="table table-bordered shadow">
                                <thead class="thead-dark" style={{ textAlign: "center" }}>
                                    <tr>
                                        <th scope="col" style={{ borderRightColor: "white" }} ></th>

                                        <th scope="col" colSpan={2} style={{ borderRightColor: "white" }} >Field Inspection</th>
                                        <th scope="col" colSpan={3} style={{ borderRightColor: "white" }} >Warehouse Inspection</th>
                                    </tr>
                                    <tr >
                                        <th scope="col" style={{ borderRightColor: "white", width: "10%" }} >Category</th>
                                        <th scope="col" style={{ borderRightColor: "white", width: "15%" }} >Parameter</th>
                                        <th scope="col" style={{ borderRightColor: "white", width: "25%" }} >Symptom</th>
                                        <th scope="col" style={{ borderRightColor: "white", width: "15%" }} >Parameter</th>
                                        <th scope="col" style={{ borderRightColor: "white", width: "25%" }} >Symptom</th>
                                        {
                                            status === 'QC Completed' &&
                                            <th scope="col" style={{ borderLeftColor: "white", width: "5%" }} >Action</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody >
                                    {
                                        data.refurbInspectionList && data.refurbInspectionList.length ?
                                            data.refurbInspectionList.map((item) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td>
                                                                <table className='table table-borderless'>

                                                                    <tbody>
                                                                        <tr>
                                                                            <td ><b>{item.categoryName}</b></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td >
                                                                <table className='table table-borderless'>

                                                                    <tbody>
                                                                        <tr>
                                                                            {
                                                                                item.keptParam && item.keptParam.length ?
                                                                                    item.keptParam.map((para) => {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    para.inspectionName === "Field Inspection" &&
                                                                                                    <>
                                                                                                        <td>{
                                                                                                            para.inspectedParam && para.inspectedParam.length ?
                                                                                                                para.inspectedParam.map((record, index) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                                               {
                                                                                                                                record.symptomList && record.symptomList.length &&
                                                                                                                                record.symptomList.map((i) => {
                                                                                                                                    return <tr><td > {record.paramName}</td></tr>

                                                                                                                                }

                                                                                                                                )
                                                                                                                            }
                                                                                                                            {index < para.inspectedParam.length - 1 &&
                                                                                                                                <Divider style={{ marginLeft: "-25px", marginRight: "-25px" }} />
                                                                                                                            }
                                                                                                                        </>
                                                                                                                    )
                                                                                                                }) :
                                                                                                                ""}
                                                                                                        </td>
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#F0F0F0", opacity: "50%" }}>
                                                                            {
                                                                                item.droppedParam && item.droppedParam.length ?
                                                                                    item.droppedParam.map((para) => {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    para.inspectionName === "Field Inspection" &&
                                                                                                    <>
                                                                                                        <td style={{ height: "auto" }}>{
                                                                                                            para.inspectedParam && para.inspectedParam.length ?
                                                                                                                para.inspectedParam.map((record, index) => {
                                                                                                                    return (
                                                                                                                        <>

                                                                                                                            {
                                                                                                                                record.symptomList && record.symptomList.length &&
                                                                                                                                record.symptomList.map((i) => {
                                                                                                                                    return <tr><td>{record.paramName}</td></tr>

                                                                                                                                }

                                                                                                                                )
                                                                                                                            }
                                                                                                                            {index < para.inspectedParam.length - 1 &&
                                                                                                                                <Divider style={{ marginLeft: "-25px", marginRight: "-25px" }} />
                                                                                                                            }
                                                                                                                        </>
                                                                                                                    )
                                                                                                                }) :
                                                                                                                ""}
                                                                                                        </td>
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </tr>

                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td>
                                                                <table className='table table-borderless'>
                                                                    <tbody>
                                                                        <tr>
                                                                            {
                                                                                item.keptParam && item.keptParam.length ?
                                                                                    item.keptParam.map((para) => {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    para.inspectionName === "Field Inspection" &&
                                                                                                    <>

                                                                                                        <td>{
                                                                                                            para.inspectedParam && para.inspectedParam.length ?
                                                                                                                para.inspectedParam.map((record, index) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            {record.symptomList && record.symptomList.length &&
                                                                                                                                record.symptomList.map((sym) => {
                                                                                                                                    return (
                                                                                                                                        <tr><td>{sym.symptomName}</td></tr>
                                                                                                                                    )
                                                                                                                                })}
                                                                                                                            {index < para.inspectedParam.length - 1 &&
                                                                                                                                <Divider style={{ marginLeft: "-25px", marginRight: "-25px" }} />
                                                                                                                            }                                                                                                                    </>
                                                                                                                    )
                                                                                                                }) :
                                                                                                                ""}
                                                                                                        </td>
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#F0F0F0", opacity: "50%" }}>
                                                                            {
                                                                                item.droppedParam && item.droppedParam.length ?
                                                                                    item.droppedParam.map((para) => {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    para.inspectionName === "Field Inspection" &&
                                                                                                    <>

                                                                                                        <td>{
                                                                                                            para.inspectedParam && para.inspectedParam.length ?
                                                                                                                para.inspectedParam.map((record, index) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            {record.symptomList && record.symptomList.length &&
                                                                                                                                record.symptomList.map((sym) => {
                                                                                                                                    return (
                                                                                                                                        <tr><td>{sym.symptomName}</td></tr>
                                                                                                                                    )
                                                                                                                                })}
                                                                                                                            {index < para.inspectedParam.length - 1 &&
                                                                                                                                <Divider style={{ marginLeft: "-25px", marginRight: "-25px" }} />
                                                                                                                            }                                                                                                                    </>
                                                                                                                    )
                                                                                                                }) :
                                                                                                                ""}
                                                                                                        </td>
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td>
                                                                <table className='table table-borderless' style={{ backgroundColor: this.state.categoryId.includes(item.categoryId) || item.droppedParam && item.droppedParam.length ? item.categoryId === "2,3" ? AOcolor : item.categoryId === "2,4" && FOcolor : "", opacity: this.state.categoryId.includes(item.categoryId) || item.droppedParam && item.droppedParam.length ? item.categoryId === "2,3" ? AOopacity : item.categoryId === "2,4" && FOopacity : "" }}>
                                                                    <tbody>
                                                                        <tr>
                                                                            {
                                                                                item.keptParam && item.keptParam.length ?
                                                                                    item.keptParam.map((para) => {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    para.inspectionName === "Warehouse Inspection" &&
                                                                                                    <>
                                                                                                        <td style={{ height: "auto" }}>{
                                                                                                            para.inspectedParam && para.inspectedParam.length ?
                                                                                                                para.inspectedParam.map((record, index) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            {
                                                                                                                                record.symptomList && record.symptomList.length &&
                                                                                                                                record.symptomList.map((i) => {
                                                                                                                                    return <tr><td > {record.paramName}</td></tr>

                                                                                                                                }

                                                                                                                                )
                                                                                                                            }
                                                                                                                            {index < para.inspectedParam.length - 1 &&
                                                                                                                                <Divider style={{ marginLeft: "-25px", marginRight: "-25px" }} />
                                                                                                                            }                                                                                                                    </>
                                                                                                                    )
                                                                                                                }) :
                                                                                                                ""}
                                                                                                        </td>

                                                                                                    </>

                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </tr>
                                                                        <tr >
                                                                            {
                                                                                item.droppedParam && item.droppedParam.length ?
                                                                                    item.droppedParam.map((para) => {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    para.inspectionName === "Warehouse Inspection" &&
                                                                                                    <>
                                                                                                        <td >{
                                                                                                            para.inspectedParam && para.inspectedParam.length ?
                                                                                                                para.inspectedParam.map((record, index) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            {
                                                                                                                                record.symptomList && record.symptomList.length &&
                                                                                                                                record.symptomList.map((i) => {
                                                                                                                                    return <tr><td > {record.paramName}</td></tr>

                                                                                                                                }

                                                                                                                                )
                                                                                                                            }
                                                                                                                            {index < para.inspectedParam.length - 1 &&
                                                                                                                                <Divider style={{ marginLeft: "-25px", marginRight: "-25px" }} />
                                                                                                                            }                                                                                                                    </>
                                                                                                                    )
                                                                                                                }) :
                                                                                                                ""}
                                                                                                        </td>
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td>
                                                                <table className='table table-borderless' style={{ backgroundColor: this.state.categoryId.includes(item.categoryId) || item.droppedParam && item.droppedParam.length ? item.categoryId === "2,3" ? AOcolor : item.categoryId === "2,4" && FOcolor : "", opacity: this.state.categoryId.includes(item.categoryId) || item.droppedParam && item.droppedParam.length ? item.categoryId === "2,3" ? AOopacity : item.categoryId === "2,4" && FOopacity : "" }}>
                                                                    <tbody>
                                                                        <tr>
                                                                            {
                                                                                item.keptParam && item.keptParam.length ?
                                                                                    item.keptParam.map((para) => {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    para.inspectionName === "Warehouse Inspection" &&
                                                                                                    <>
                                                                                                        <td >{
                                                                                                            para.inspectedParam && para.inspectedParam.length ?
                                                                                                                para.inspectedParam.map((record, index) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            {record.symptomList && record.symptomList.length &&
                                                                                                                                record.symptomList.map((sym) => {
                                                                                                                                    return (
                                                                                                                                        <tr><td>{sym.symptomName}</td></tr>
                                                                                                                                    )
                                                                                                                                })}
                                                                                                                            {index < para.inspectedParam.length - 1 &&
                                                                                                                                <Divider style={{ marginLeft: "-25px", marginRight: "-25px" }} />
                                                                                                                            }                                                                                                                        {/* </td> */}
                                                                                                                        </>
                                                                                                                    )
                                                                                                                }) :
                                                                                                                ""}
                                                                                                        </td>
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </tr>
                                                                        <tr >
                                                                            {
                                                                                item.droppedParam && item.droppedParam.length ?
                                                                                    item.droppedParam.map((para) => {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    para.inspectionName === "Warehouse Inspection" &&
                                                                                                    <>
                                                                                                        <td>{
                                                                                                            para.inspectedParam && para.inspectedParam.length ?
                                                                                                                para.inspectedParam.map((record, index) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            {record.symptomList && record.symptomList.length &&
                                                                                                                                record.symptomList.map((sym) => {
                                                                                                                                    return (
                                                                                                                                        <tr><td>{sym.symptomName}</td></tr>
                                                                                                                                    )
                                                                                                                                })}
                                                                                                                            {index < para.inspectedParam.length - 1 &&
                                                                                                                                <Divider style={{ marginLeft: "-25px", marginRight: "-25px" }} />
                                                                                                                            }

                                                                                                                        </>
                                                                                                                    )
                                                                                                                }) :
                                                                                                                ""}
                                                                                                        </td>
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            {
                                                                status === 'QC Completed' &&
                                                                <td>
                                                                    {
                                                                        item.categoryId === "2,3" ?
                                                                            <Checkbox className="checkColor" defaultChecked={item.droppedParam && item.droppedParam.length ? false : true} onChange={(e, val) => { this.setAoAmt(val, data.aoAmt, "2,3") }} />
                                                                            :
                                                                            ""
                                                                    }
                                                                    {
                                                                        item.categoryId === "2,4" ?
                                                                            <Checkbox className="checkColor" defaultChecked={item.droppedParam && item.droppedParam.length ? false : true} onChange={(e, val) => { this.setFoAmt(val, data.foAmt, "2,4") }} />
                                                                            :
                                                                            ""
                                                                    }
                                                                </td>
                                                            }
                                                        </tr>
                                                    </>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan={7}>
                                                    <div style={{ color: "red", textAlign: "center", padding: "25px" }}>
                                                        <h2 >NO Data</h2>
                                                    </div>
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                        </DialogContent>
                        <DialogActions >
                            <div colSpan={2} style={{ padding: "25px", marginRight: "270px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}> Field Inspection Total Refurb Cost <snap style={{ border: "1px solid #0AAA2D", padding: "10px", marginRight: "15px", marginLeft: "15px", backgroundColor: "rgba(76, 220, 108, 0.19)", color: "#0AAA2D", borderRadius: "10%" }}>{getAmount(data.fiRefurbCost && data.fiRefurbCost)}</snap></div>
                            <div colSpan={3} style={{ padding: "25px", marginRight: "270px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>Warehouse Inspection Total Refurb Cost <snap style={{ border: "1px solid #0AAA2D", padding: "10px", marginRight: "15px", marginLeft: "15px", backgroundColor: "rgba(76, 220, 108, 0.19)", color: "#0AAA2D", borderRadius: "10%" }}>{getAmount(wiRefurbCost)}</snap></div>
                        </DialogActions>
                         </Dialog>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({

})


export default connect()(inspectionDialog)