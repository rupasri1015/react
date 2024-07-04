import React, { Component } from 'react'
import { connect } from 'react-redux'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TabPanel from './components/TabPanel'
import UserDetails from './components/UserDetails'
import VehicleDetails from './components/VehicleDetails'
import InspectionDetails from './components/InspectionDetails'
import BiddingDetails from './components/BiddingDetails'
import ExchangeDetails from './components/ExchangeDetails'
import ShowroomDetails from './components/FHDShowroomDetails'
import ValuatorDetails from './components/ValuatorDetails'
import TATDetails from './components/TATDetails'
import DocumentAndImages from './components/DocumentAndImages'
import { leadDetails, resetBiddingLead } from '../../redux/actions/biddingDetailsAction'
import NewInspectionDetails from './components/NewInspectionDetails'
class BiddingDetailsTab extends Component {

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
      customerInfo,
      vehicleDetails,
      inspsParams,
      imagesList,
      bidderInfo,
      biddingInfo,
      orderInfo,
      valuatorInfo,
      storeDetails,
      leadHistory,
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
          <Tab label="User Details" className="tab-style" {...this.tabProps(0)} />
          <Tab label="Vehicle Details" className="tab-style" {...this.tabProps(1)} />
          <Tab label="Inspection Details" className="tab-style" {...this.tabProps(2)} />
          <Tab label="Bidding Details" className="tab-style" {...this.tabProps(3)} />
          <Tab label="Documents and Images" className="tab-style" {...this.tabProps(4)} />
          <Tab label="Exchange Details" className="tab-style" {...this.tabProps(5)} />
          <Tab label="FHD Showroom Details" className="tab-style" {...this.tabProps(6)} />
          <Tab label="Valuator Details" className="tab-style" {...this.tabProps(7)} />
          <Tab label="TAT Information" className="tab-style" {...this.tabProps(8)} />
        </Tabs>
        <TabPanel value={currentTab} index={0}>
          <UserDetails user={customerInfo} leadId={vehicleDetails.leadId} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <VehicleDetails vehicle={vehicleDetails} />
        </TabPanel>
        {/* <TabPanel value={currentTab} index={2}>
          <InspectionDetails NewInspectionParameters={imagesList} OldInspectionParameters={inspsParams}/>
        </TabPanel> */}
        {
          imagesList && Boolean(imagesList.length) ?
            <TabPanel value={currentTab} index={2}>
              <InspectionDetails inspectionParameters={imagesList} />
            </TabPanel> :
            inspsParams && Boolean(inspsParams.length) ?
              <TabPanel value={currentTab} index={2}>
                <NewInspectionDetails inspectionParameters={inspsParams} />
              </TabPanel> :
              <TabPanel value={currentTab} index={2}>
                <h3>No Data Avilable</h3>
              </TabPanel>
        }
        <TabPanel value={currentTab} index={3}>
          <BiddingDetails
            bidders={bidderInfo}
            biddingDetail={biddingInfo}
            status={vehicleDetails.leadStatus}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={4}>
          <DocumentAndImages
            userDocs={vehicleDetails}
            vehicleDocs={imagesList ? imagesList : inspsParams}
            checkData={imagesList ? "new" : "old"}
            kycDocs={userBankDocs}
            deliveryNotes={userBankDocsValue}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={5}>
          <ExchangeDetails exchange={orderInfo} valuator={valuatorInfo} store={storeDetails} vehicle={vehicleDetails} />
        </TabPanel>
        <TabPanel value={currentTab} index={6}>
          <ShowroomDetails showroom={storeDetails} />
        </TabPanel>
        <TabPanel value={currentTab} index={7}>
          <ValuatorDetails valuator={valuatorInfo} />
        </TabPanel>
        <TabPanel value={currentTab} index={8}>
          <TATDetails history={leadHistory} />
        </TabPanel>
      </div >
    )
  }
}

export default connect(state => ({ biddingLeadDetails: state.biddingDetails.leadDetails }))(BiddingDetailsTab)