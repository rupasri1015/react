import React, { Component } from 'react'
import { connect } from 'react-redux'
import './businessEntity.scss'
import { Card, CardBody, CardFooter } from 'reactstrap'
import Button from '@material-ui/core/Button'
import PlusIcon from '@material-ui/icons/AddCircle';
import Edit from '@material-ui/icons/BorderColorOutlined';
import { withRouter } from 'react-router-dom';
import { getEntites, getEntity } from '../../../core/services/franchiseServices';
import { getStoreId } from '../../../core/services/authenticationServices';
import { setNotification } from '../../../redux/actions/notificationAction';

class View extends Component {
    state = {
        users: [1, 2, 3, 4, 5],
        entites: [],
        i: 0,
        isReadMore: true,
        isReadLess: false,
        expand: false,
        id: null
    };
    initialState = {}
    toggleReadMore = (u) => {
        this.setState({ isReadMore: !this.state.isReadMore });
        this.setState({ isReadLess: !this.state.isReadLess });
        this.setState({ expand: true })
        this.setState({ id: u })
    }
    toggleReadLess = (u) => {
        this.setState({ isReadMore: !this.state.isReadMore });
        this.setState({ isReadLess: !this.state.isReadLess });
        this.setState({ expand: false })
        this.setState({ id: u })
    }
    componentDidMount() {
        const id = getStoreId();
        getEntites(id)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ entites: apiResponse.listBusinessEntity })
                }
            })
    }
    handleEdit = (id) => {
        const { dispatch, history, location } = this.props
        getEntity(id)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.initialState = { ...apiResponse.businessEntityBean }
                    this.props.history.push({
                        pathname: '/business_entity',
                        state: { initialState: this.initialState, action: "edit" }
                    })
                }
                else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message))
                }
            })
    }

    addMore = () => {
        this.initialState = {
            store_Name: "",
            gst_Regis_type: "",
            gst_Regis_No: "",
            biller_Pan_No: "",
            biller_Bank_Acc_No: "",
            biller_Name: "",
            biller_bank_Name: "",
            bank_branch: "",
            bank_ifsc: "",
            biller_mobile: "",
            biller_email: "",
            biller_Address: "",
            biller_Address_line_2: "",
            biller_State_Name: "",
            biller_City_Name: "",
            biller_pincode: ""
        }
        this.props.history.push({
            pathname: '/business_entity',
            state: { initialState: this.initialState, action: 'add' }
        })

    }
    getBooleanValue = (i) => {
        const isReadMore = this.state.isReadMore;
        const id = this.state.id;
        if (isReadMore && id != i || !isReadMore && id != i || isReadMore && id == i) {
            return true;
        }
    }
    render() {
        const isReadMore = this.state.isReadMore;
        const isReadLess = this.state.isReadLess;
        const expandData = this.state.expand;
        const id = this.state.id;
        const { entites } = this.state
        return (
            <div id='businessEntity'>
                <div className="row" style={{ width: '868px' }}>
                    <div className="col-sm-5">
                        <h3 className="float-left">Business Entity Details</h3>
                    </div>
                    {
                        entites && Boolean(entites.length) ?
                            <Button startIcon={<PlusIcon style={{ width: '25px', height: '25px' }} />} onClick={this.addMore} className="float-right addbtn" color="success" >
                                {entites && Boolean(entites.length) ? 'ADD MORE' : 'ADD\u00a0BUSINESS\u00a0ENTITY'}
                            </Button> :
                            <Button startIcon={<PlusIcon style={{ width: '25px', height: '25px' }} />} onClick={this.addMore} className="float-right addBusinessBtn" color="success" >
                                {entites && Boolean(entites.length) ? 'ADD MORE' : 'ADD\u00a0BUSINESS\u00a0ENTITY'}
                            </Button>
                    }
                </div>
                {this.state.entites && Boolean(this.state.entites.length) && this.state.entites.map((entity, i) => (
                    <Card className="customcardview mb-3" >
                        <CardBody style={{ backgroundColor: "#FAFAFA" }}>
                            <div className="row">
                                <div className="col-sm-1">
                                    <div className="numdiv">{i + 1}</div>
                                </div>
                                <div className="col-sm-8">
                                    <h5 className="mb-3">GST Info</h5>
                                    <table>
                                        <tr>
                                            <td style={{ width: '30%' }}> <p className="labelstyle">Business Legal Name</p></td>
                                            <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                            <td> <p className="labelvalstyle">{entity.store_Name != null ? entity.store_Name : "------"}</p></td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '30%' }}><p className="labelstyle">GST Regestration Type</p></td>
                                            <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                            <td><p className="labelvalstyle">{entity.gst_Regis_type != null ? entity.gst_Regis_type : "------"}</p></td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '30%' }}><p className="labelstyle">GST Number</p></td>
                                            <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                            <td><p className="labelvalstyle">{entity.gst_Regis_No != "000000000000000" ? entity.gst_Regis_No : "NA"}</p></td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '30%' }}><p className="labelstyle">PAN Number</p></td>
                                            <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                            <td><p className="labelvalstyle">{entity.biller_Pan_No != null ? entity.biller_Pan_No : "------"}</p></td>
                                        </tr>
                                        {
                                            expandData && id == i &&
                                            <>
                                                <tr >
                                                    <td style={{ width: '30%' }}><h5 style={{ marginTop: '15px' }} className="mb-3">Bank Details</h5></td></tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Account Number</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.biller_Bank_Acc_No != null ? entity.biller_Bank_Acc_No : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Account Holder name</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.biller_Name != null ? entity.biller_Name : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">IFSC Code</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.bank_ifsc != null ? entity.bank_ifsc : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Bank Name</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle"> {entity.biller_bank_Name != null ? entity.biller_bank_Name : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Branch Name</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle"> {entity.bank_branch != null ? entity.bank_branch : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><h5 style={{ marginTop: '15px' }} className="mb-3">Compay Details</h5></td></tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Mobile Number</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.biller_mobile != null ? entity.biller_mobile : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Email Id</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.biller_email != null ? entity.biller_email : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Address Line1</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.biller_Address != null ? entity.biller_Address : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Address Line2</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle"> {entity.biller_Address_line_2 != null ? entity.biller_Address_line_2 : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">State</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.biller_State_Name != null ? entity.biller_State_Name : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">City</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.biller_City_Name != null ? entity.biller_City_Name : "------"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '30%' }}><p className="labelstyle">Zip Code</p></td>
                                                    <td><p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p></td>
                                                    <td><p className="labelvalstyle">{entity.biller_pincode != null ? entity.biller_pincode : "------"}</p></td>
                                                </tr>
                                            </>
                                        }
                                    </table>
                                </div>
                                <div className="col-sm-3">
                                    <Button className="float-right editbtn" onClick={() => this.handleEdit(entity.billerId)} color="primary" name={entity.billerId} startIcon={<Edit />}>
                                        Edit
                                    </Button>
                                </div>
                            </div>
                            <div className="viewData" >
                                {
                                    isReadMore && id != i &&
                                    <span className="viewData" onClick={() => this.toggleReadMore(i)}>View More... </span>
                                }
                                {
                                    !isReadMore && id != i &&
                                    <span className="viewData" onClick={() => this.toggleReadMore(i)}>View More... </span>
                                }
                                {/* {
                                    !isReadMore && id == i && isReadLess &&
                                    <span className="viewData" onClick={() => this.toggleReadLess(i)}>View Less...</span>

                                } */}
                                {/* { isReadMore && id == i &&
                                    <span className="viewData" onClick={() => this.toggleReadMore(i)}>View less... </span>

                                } */}
                                {/* {
                                    this.getBooleanValue(i) && 
                                    <span className="viewData" onClick={() => this.toggleReadMore(i)}>View More... </span>

                                } */}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        )
    }
}
export default withRouter(connect()(View));