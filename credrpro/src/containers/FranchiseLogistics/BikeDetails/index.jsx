import React, { Component } from 'react'
import { connect } from 'react-redux'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TabPanel from './components/TabPanel'
import VehicleDetails from './components/VehicleDetails'
import InspectionDetails from './components/InspectionDetails'
import DocumentAndImages from './components/DocumentAndImages'
import { leadDetails, resetBiddingLead } from '../../../redux/actions/biddingDetailsAction'

class BikeDetails extends Component {

  state = {
    currentTab: 0
  }

  componentDidMount() {
    const { match, dispatch } = this.props
    dispatch(leadDetails(match.params.leadId))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetBiddingLead())
  }

  handleTabChange = (event, nextValue) => {
    this.setState({ currentTab: nextValue })
  }

  tabProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    }
  }

  render() {
    const { biddingLeadDetails } = this.props
    const { currentTab } = this.state
    const {
      vehicleDetails,
      inspsParams,
      userBankDocs,
      userBankDocsValue
    } = biddingLeadDetails
    return (
      Boolean(Object.keys(biddingLeadDetails).length) &&
      < div className="tab-container" >
        <Tabs
          orientation="vertical"
          value={currentTab}
          onChange={this.handleTabChange}
          classes={{ indicator: 'indicator-color' }}
          style={{ marginTop: 10 }}
        >
          <Tab label="Vehicle Details" className="tab-style" {...this.tabProps(1)} />
          <Tab label="Inspection Details" className="tab-style" {...this.tabProps(2)} />
          <Tab label="Documents and Images" className="tab-style" {...this.tabProps(4)} />
        </Tabs>
        <TabPanel value={currentTab} index={1}>
          <VehicleDetails vehicle={vehicleDetails} />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <InspectionDetails inspectionParameters={inspsParams} />
        </TabPanel>
        <TabPanel value={currentTab} index={4}>
          <DocumentAndImages
            userDocs={vehicleDetails}
            vehicleDocs={inspsParams}
            kycDocs={userBankDocs}
            deliveryNotes={userBankDocsValue}
          />
        </TabPanel>
      </div >
    )
  }
}

export default connect(state => ({ biddingLeadDetails: state.biddingDetails.leadDetails }))(BikeDetails)