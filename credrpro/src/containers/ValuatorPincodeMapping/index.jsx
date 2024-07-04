import React, { Component } from 'react'
import FilterComponent from './components/FilterComponent'
import TableComponent from './components/TableComponent'
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { getPincodes, getSearchPincodes, updatePincodes } from '../../core/services/valuatorServices';
import { getUserID, getRole, getCityID } from '../../core/services/rbacServices';
import { getUserCityList } from '../../core/services/userInfoStorageServices';
import { setNotification } from '../../redux/actions/notificationAction'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { connect } from 'react-redux'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

 class ValuatorPincode extends Component {
    state = {
        userType: 'Valuator',
        data: [],
        availablePincodes: [],
        pincodes: [],
        updatePincodes: [],
        total: 0,
        pageNum: 1,
        cityId: getUserCityList(),
        openAlert:false,
        alertMessage:"",
        statusColor:"",
        // userType:null

    }

    componentDidMount() {
        const { dispatch } = this.props
        let payload = {}
        let pageNo = 1;
        let pageSize = 10;
        payload.centralUserId = getUserID();
        payload.pageNo = pageNo;
        payload.pageSize = pageSize;
        payload.userTypeName = "Valuator";
        payload.userCityList = this.state.cityId
        getPincodes(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ data: apiResponse.resultSet })
                    this.setState({ total: apiResponse.resultCount })
                }
                else {
                    dispatch(setNotification(
                        'danger',
                        'Error',
                        apiResponse.message
                    ))
                }
            })
    }
    handleChange = (event, newValue) => {
        const { dispatch } = this.props
        this.setState({ cityId: getUserCityList() })
        this.setState({ userType: newValue })
        let payload = {}
        let pageNo = 1;
        let pageSize = 10;
        payload.centralUserId = getUserID();
        payload.pageNo = pageNo;
        payload.pageSize = pageSize;
        payload.userTypeName = newValue;
        payload.userCityList = getUserCityList()
        getPincodes(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ data: apiResponse.resultSet })
                    this.setState({ total: apiResponse.resultCount })
                }
                else {
                    dispatch(setNotification(
                        'danger',
                        'Error',
                        apiResponse.message
                    ))
                }
            })
        this.setState({ value: newValue })
        this.setState({ pincodes: [] })
        this.setState({ availablePincodes: [] })

    };
    handleDropdown = (payload) => {
        const { dispatch } = this.props
        this.setState({ cityId: payload.userCityList })
        getPincodes(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ data: apiResponse.resultSet })
                    this.setState({ total: apiResponse.resultCount })
                }
                else {
                    dispatch(setNotification(
                        'danger',
                        'Error',
                        apiResponse.message
                    ))
                }
            })
        this.setState({ pincodes: [] })
        this.setState({ availablePincodes: [] })
    }
    setPincodes = ((payload, pincodes) => {
        const { dispatch } = this.props
        const { userType } = this.state
        this.setState({ pincodes: pincodes })
        if (this.state.availablePincodes.length) {
            this.setState({ availablePincodes: [] })
        }
        payload.userTypeName = userType
        getSearchPincodes(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    apiResponse.resultSet && apiResponse.resultSet.length && apiResponse.resultSet.map((item) => {
                        this.setState({ availablePincodes: [...this.state.availablePincodes, { label: item, value: item }] })
                    })
                }
                else {
                    dispatch(setNotification(
                        'danger',
                        'Error',
                        apiResponse.message
                    ))
                }
            })
    })
    onDelete = ((data, currentPage,username) => {
        const { dispatch } = this.props
        updatePincodes(data)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ pincodes: [] })
                    this.setState({ pincodes: data.pinCodes })
                    let payload = {}
                    let pageNo = currentPage;
                    let pageSize = 10;
                    payload.centralUserId = getUserID();
                    payload.pageNo = pageNo;
                    payload.pageSize = pageSize;
                    payload.userTypeName = this.state.userType;
                    payload.userCityList = this.state.cityId
                    getPincodes(payload)
                        .then(apiResponse => {
                            if (apiResponse.isValid) {
                                this.setState({ data: apiResponse.resultSet })
                                this.setState({ total: apiResponse.resultCount })
                                let pinPayload = {}
                                pinPayload.cityId = this.state.cityId
                                pinPayload.userTypeName = "Valuator"
                                getSearchPincodes(pinPayload)
                                    .then(apiResponse => {
                                        if (apiResponse.isValid) {
                                            apiResponse.resultSet && apiResponse.resultSet.length && apiResponse.resultSet.map((item) => {
                                                this.setState({ availablePincodes: [{ label: item, value: item }] })
                                            })
                                        }
                                    })
                            }
                            else {
                                dispatch(setNotification(
                                    'danger',
                                    'Error',
                                    apiResponse.message
                                ))
                            }
                        })
                        this.setState({alertMessage:"Pincode Unassigned to "+username})
                        this.setState({statusColor:"error"})
                        this.setState({openAlert:true})  
                }
                else {
                    dispatch(setNotification(
                        'danger',
                        'Error',
                        apiResponse.message
                    ))
                }
            })
    })
    handleAlertClose=(()=>{
        this.setState({openAlert:false})
    })
    onPagechange = ((pageNum) => {
        const { dispatch } = this.props

        this.setState({ pageNum: pageNum })
        let payload = {}

        // let pageNo = 1;
        let pageSize = 10;
        payload.centralUserId = getUserID();
        payload.pageNo = pageNum;
        payload.pageSize = pageSize;
        payload.userTypeName = this.state.userType;
        payload.userCityList = this.state.cityId
        getPincodes(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ data: apiResponse.resultSet })
                    this.setState({ total: apiResponse.resultCount })
                }
                else {
                    dispatch(setNotification(
                        'danger',
                        'Error',
                        apiResponse.message
                    ))
                }
            })
    })
    onUpdate = ((data, currentPage,username) => {
        const { dispatch } = this.props
        const { userType } = this.state
        updatePincodes(data)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ pincodes: [] })
                    this.setState({ pincodes: data.pinCodes })
                    let payload = {}
                    let pageNo = currentPage;
                    let pageSize = 10;
                    payload.centralUserId = getUserID();
                    payload.pageNo = pageNo;
                    payload.pageSize = pageSize;
                    payload.userTypeName = this.state.userType;
                    payload.userCityList = this.state.cityId
                    getPincodes(payload)
                        .then(apiResponse => {
                            if (apiResponse.isValid) {
                                this.setState({ data: apiResponse.resultSet })
                                this.setState({ total: apiResponse.resultCount })
                                let pinPayload = {}
                                pinPayload.cityId = this.state.cityId
                                pinPayload.userTypeName = userType
                                getSearchPincodes(pinPayload)
                                    .then(apiResponse => {
                                        if (apiResponse.isValid) {
                                            apiResponse.resultSet && apiResponse.resultSet.length && apiResponse.resultSet.map((item) => {
                                                this.setState({ availablePincodes: [{ label: item, value: item }] })
                                            })
                                        }
                                    })
                                    this.setState({alertMessage:"Pincode Assigned to "+username})
                                    this.setState({statusColor:"success"})
                                    this.setState({openAlert:true})

                            }
                            else {
                                dispatch(setNotification(
                                    'danger',
                                    'Error',
                                    apiResponse.message
                                ))
                            }
                        })
                }
                else {
                    dispatch(setNotification(
                        'danger',
                        'Error',
                        apiResponse.message
                    ))
                }
            })
    })
    render() {
        const { data, availablePincodes, pincodes, total,openAlert,alertMessage,statusColor } = this.state
        return (
            <div>
                <Snackbar open={openAlert} anchorOrigin={{ vertical: 'buttom', horizontal: 'right' }} autoHideDuration={5000} onClose={this.handleAlertClose}>
                    <Alert onClose={this.handleAlertClose} severity={statusColor} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={this.state.userType}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={this.handleChange} aria-label="lab API tabs example">
                                <Tab label="Valuator" value="Valuator" />
                                <Tab label="DIY Valuator" value="DIY_ASSIST" />
                            </TabList>
                        </Box>
                        <TabPanel value="Valuator" style={{ padding: "0px" }}>
                            <FilterComponent handleDropdown={this.handleDropdown} userType="Valuator" />
                            <TableComponent  userType="Valuator" data={data} setPincodes={this.setPincodes} availablePincodes={availablePincodes} total={total} onPagechange={this.onPagechange} pincodes={pincodes} onDelete={this.onDelete} onUpdate={this.onUpdate} />
                        </TabPanel>
                        <TabPanel value="DIY_ASSIST" style={{ padding: "0px" }}>
                            <FilterComponent handleDropdown={this.handleDropdown} userType="DIY_ASSIST" />
                            <TableComponent  userType="DIY_ASSIST" data={data} setPincodes={this.setPincodes} availablePincodes={availablePincodes} total={total} onPagechange={this.onPagechange} pincodes={pincodes} onDelete={this.onDelete} onUpdate={this.onUpdate} />
                        </TabPanel>
                    </TabContext>
                </Box>
              
            </div>
        )
    }
}

export default connect()(ValuatorPincode);