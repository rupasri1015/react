import React, { Component, Fragment, useState } from "react";
import BiddingDataTable from "./components/BiddingDataTable";
import BiddingFilter from "./components/BiddingFilter";
import { connect } from "react-redux";
import BiddingHeader from "./components/BiddingHeader";
import { biddingList } from "../../redux/actions/biddingListAction";
import isEqual from "lodash/isEqual";
import RebidDialog from "./components/RebidDialog";
import BiddingDataDialog from "./components/BiddingDataDialog";
import { showLoader, hideLoader } from "../../redux/actions/loaderAction";
import {
  getUserDetails,
  getVehicleDetails,
  getValuatorDetails,
  getBiddingDetails,
} from "../../core/services/biddingServices";
import { setNotification } from "../../redux/actions/notificationAction";
import {
  getBikeName,
  getDate,
  getAmount,
  autoRefresh,
  stopRefresh,
  isRegistrationNumber,
} from "../../core/utility";
import DropDialog from "./components/DropDialog";
import RegistrationDialog from "./components/RegistrationDialog";
import Checkbox from "@material-ui/core/Checkbox";
import { Card, CardBody } from "reactstrap";
import SearchField from "../../shared/components/form/Search";
import {
  getFirstName,
  getLastName,
  getEmail,
  getAltNumber,
  getImage,
  getDob,
} from "../../core/services/userInfoStorageServices";
import Slide from "@material-ui/core/Slide";
import { getUserID } from "../../core/services/rbacServices";
import CallToCustomerDialog from "./components/calltoCustomer";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class BiddingDashboard extends Component {
  state = {
    filters: {},
    isOpen: false,
    title: null,
    columns: [],
    data: null,
    isArray: false,
    open: false,
    openDrop: false,
    openRegistration: false,
    status: "ONGOING",
    isRegistrationSearch: false,
    searchText: "",
    universalCheck: false,
    isModelOpen: false,
    check: "",
    openCallModel: false,
    callData: {},
    biddingHistoryLen: 0,
  };
  fields = {
    first_name: getFirstName(),
    last_name: getLastName(),
    u_dob: getDob(),
    u_email: getEmail(),
  };

  handleClickOpen = () => {
    this.setState({ isModelOpen: true });
  };
  handleOpenCallModel = (data) => {
    this.setState({ openCallModel: true });
    this.setState({ callData: data });
  };
  handleCloseCallModel = (data) => {
    this.setState({ openCallModel: false });
    this.setState({ callData: "" });
  };
  handleClose = () => {
    this.setState({ isModelOpen: false });
  };

  handleUpdate = () => {
    const { history } = this.props;
    history.push("/updateprofile");
  };

  componentDidMount() {
    // autoRefresh(this.refreshData)
    if (getEmail() === "" || getLastName() === "" || getDob === "") {
      this.handleClickOpen();
    }
  }

  componentWillUnmount() {
    stopRefresh();
  }

  refreshData = () => {
    const { dispatch, pageNum } = this.props;
    const { status, filters, universalCheck } = this.state;
    if (universalCheck === true) {
      dispatch(
        biddingList({
          ...filters,
          pageNum,
          status,
          isUniversalSearch: true,
          userId: getUserID(),
        })
      );
    } else {
      dispatch(
        biddingList({ ...filters, pageNum, status, userId: getUserID() })
      );
    }
  };

  handleClearFilter = () => {
    this.setState({ searchText: "", universalCheck: false });
    if (this.state.filters.regNum) {
      this.clearFilters();
    }
  };

  handleSearch = () => {
    if (this.state.searchText) {
      this.applySearch({ regNum: this.state.searchText });
    }
  };

  applyFilter = (filters) => {
    const { filters: prevFilters, universalCheck } = this.state;
    const { dispatch } = this.props;
    if (!isEqual(prevFilters, filters)) {
      const state = { filters, status: "ONGOING" };
      if (
        filters.searchKeyword &&
        isRegistrationNumber(filters.searchKeyword.toUpperCase())
      ) {
        state.isRegistrationSearch = true;
      }
      this.setState(state, () => {
        window.scrollTo(0, 0);
        dispatch(
          biddingList({
            ...filters,
            pageNum: 1,
            status: "ONGOING",
            userId: getUserID(),
          })
        );
      });
    }
  };

  applySearch = (filters) => {
    const { universalCheck } = this.state;
    const { dispatch } = this.props;
    const state = { filters, status: "ONGOING" };
    if (filters.regNum && isRegistrationNumber(filters.regNum.toUpperCase())) {
      state.isRegistrationSearch = true;
    }
    this.setState(state, () => {
      window.scrollTo(0, 0);
      if (universalCheck === true) {
        if (filters.regNum.length >= 6) {
          dispatch(
            biddingList({
              ...filters,
              pageNum: 1,
              status: "ONGOING",
              isUniversalSearch: true,
              userId: getUserID(),
            })
          );
        } else {
          dispatch(
            setNotification(
              "danger",
              "Please Enter Correct Registration Number"
            )
          );
          //dispatch(biddingList({ pageNum: 1, status: 'ALL'}))
        }
      } else {
        dispatch(
          biddingList({
            ...filters,
            pageNum: 1,
            status: "ONGOING",
            userId: getUserID(),
          })
        );
      }
    });
  };

  updateStatus = (status) => {
    const { filters, universalCheck } = this.state;
    const { dispatch } = this.props;
    let payload = { status, pageNum: 1, userId: getUserID() };
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters };
    }
    if (universalCheck === true) {
      let payload = { status, pageNum: 1, isUniversalSearch: true };
      payload = { ...payload, ...filters };
      this.setState({ status });
      window.scrollTo(0, 0);
      dispatch(biddingList(payload));
    } else {
      let payload = { status, pageNum: 1, userId: getUserID() };
      payload = { ...payload, ...filters };
      this.setState({ status });
      window.scrollTo(0, 0);
      dispatch(biddingList(payload));
    }
  };

  handlePageChange = (pageNum) => {
    const { dispatch } = this.props;
    const { filters, status } = this.state;
    let payload = { status, pageNum, userId: getUserID() };
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters };
    }
    window.scrollTo(0, 0);
    dispatch(biddingList(payload));
  };

  clearFilters = () => {
    const { filters: prevFilters } = this.state;
    const { dispatch } = this.props;
    if (Object.keys(prevFilters).length) {
      this.setState({ filters: {}, status: "ONGOING" }, () => {
        window.scrollTo(0, 0);
        dispatch(
          biddingList({ status: "ONGOING", pageNum: 1, userId: getUserID() })
        );
      });
    }
  };

  // exportFile = () => {
  //   const { dispatch } = this.props
  //   const { filters, status } = this.state
  //   dispatch(showLoader())
  //   let payload = { status }
  //   if (Object.keys(filters).length) {
  //     payload = { ...payload, ...filters }
  //   }
  //   exportToExel(payload)
  //     .then(apiResponse => {
  //       if (apiResponse.isValid) {
  //         const { downloadUrl } = apiResponse
  //         window.location.href = downloadUrl
  //       } else {
  //         dispatch(setNotification(
  //           'danger',
  //           'Error',
  //           apiResponse.message
  //         ))
  //       }
  //       dispatch(hideLoader())
  //     })
  // }

  showCutomerDetails = (id) => {
    const { dispatch } = this.props;
    dispatch(showLoader());
    const columns = [
      { id: "userFirstName", label: "Customer Name" },
      { id: "userMobileNumber", label: "Customer Number" },
      { id: "userProofType", label: "ID Proof Type" },
      { id: "userIdProofValue", label: "ID Proof Number" },
      { id: "ownerName", label: "Owner Name" },
      { id: "userAddress1", label: "Address Line\u00a01" },
      { id: "userAddress2", label: "Address Line\u00a02" },
    ];
    getUserDetails(id).then((apiResponse) => {
      if (apiResponse.isValid) {
        this.setState({
          data: apiResponse.userInfo,
          columns,
          isArray: false,
          title: "Customer Details",
          isOpen: true,
          cta: "Close",
          check: "customer",
        });
      } else {
        dispatch(setNotification("danger", "Error", apiResponse.message));
      }
      dispatch(hideLoader());
    });
  };

  showVehicleDetails = (id) => {
    const { dispatch } = this.props;
    dispatch(showLoader());
    const columns = [
      { id: "mmv", label: "MMV" },
      { id: "bikeManufacturerYear", label: "Year" },
      { id: "bikeRegistrationNumber", label: "Registration Number" },
      { id: "noOfUsers", label: "Number Of Owners" },
      { id: "bikeFinance", label: "Finance (Y/N)" },
      { id: "insurance", label: "Insurance (Y/N)" },
      { id: "bikeChallan", label: "Challan" },
    ];
    getVehicleDetails(id).then((apiResponse) => {
      if (apiResponse.isValid) {
        const data = apiResponse.vehicleDetails;
        data.mmv = getBikeName(
          data.bikeManufactureName,
          data.bikeModelName,
          data.bikeVariantName
        );
        data.bikeChallan = getAmount(data.bikeChallan);
        this.setState({
          data,
          columns,
          isArray: false,
          title: "Vehicle Details",
          isOpen: true,
          cta: "Close",
          check: "vehicle",
        });
      } else {
        dispatch(setNotification("danger", "Error", apiResponse.message));
      }
      dispatch(hideLoader());
    });
  };

  rebid = (auctionData) => {
    const { dispatch } = this.props;
    if (Number(auctionData.customerExpectedPrice) === 0) {
      dispatch(
        setNotification(
          "danger",
          "Error",
          "Please enter customer expected price"
        )
      );
    } else {
      this.setState({
        open: true,
        data: auctionData,
      });
    }
  };

  markedAsDrop = (auctionData) => {
    this.setState({
      openDrop: true,
      data: auctionData,
    });
  };

  changeRegistartionNumber = (auctionData) => {
    this.setState({
      openRegistration: true,
      data: auctionData,
    });
  };

  closeDialog = () => {
    this.setState({
      isOpen: false,
      title: null,
      columns: [],
      data: null,
    });
  };

  closeActionDialog = () => {
    this.setState({
      open: false,
      data: null,
    });
  };

  closeDropDialog = () => {
    this.setState({
      openDrop: false,
      data: null,
    });
  };

  closeRegistrationDialog = () => {
    this.setState({
      openRegistration: false,
      data: null,
    });
  };

  showValuatorDetails = (valuator) => {
    const { dispatch } = this.props;
    dispatch(showLoader());
    const columns = [
      { id: "storeName", label: "Outlet Name" },
      { id: "storeLocation", label: "Outlet Location" },
      { id: "storeContactNumber", label: "Outlet Number" },
      { id: "storeType", label: "Outlet Type" },
      { id: "storeIncentive", label: "Store Incentive" },
    ];
    const { storeId, valuatorId } = valuator;
    getValuatorDetails(storeId, valuatorId).then((apiResponse) => {
      if (apiResponse.isValid) {
        const storeData = {
          ...apiResponse.userInfo,
          storeIncentive: getAmount(apiResponse.userInfo.storeIncentive),
        };
        this.setState({
          data: storeData,
          columns,
          isArray: false,
          title: "Outlet Details",
          isOpen: true,
          cta: "Close",
          check: "valuator",
        });
      } else {
        dispatch(setNotification("danger", "Error", apiResponse.message));
      }
      dispatch(hideLoader());
    });
  };

  updateStatusForHeader = (status) => {
    this.setState({ status, isRegistrationSearch: false });
  };

  showSummary = (auctionData) => {
    const summaryData = {
      ...auctionData,
      highestBid: getAmount(auctionData.highestBid),
      orderCreatedAt: getDate(auctionData.orderCreatedAt),
      orderVoucherPrice: getAmount(auctionData.orderVoucherPrice),
      customerExpectedPrice: getAmount(auctionData.customerExpectedPrice),
      displayPrice: getAmount(auctionData.displayPrice),
    };
    const columns = [
      { id: "valuatorName", label: `Valuator's Name` },
      { id: "highestBid", label: "Bidding Price" },
      { id: "orderCreatedAt", label: "Exchange Date" },
      { id: "orderVoucherCode", label: "Voucher Code" },
      { id: "orderVoucherPrice", label: "Voucher Price" },
      { id: "customerExpectedPrice", label: "Customer Expectation" },
      { id: "buyBack", label: "Store Buy Back" },
      { id: "displayPrice", label: "Display Price" },
    ];
    this.setState({
      data: summaryData,
      columns,
      isArray: false,
      title: "Summary",
      isOpen: true,
      cta: "View All",
      check: "summery",
    });
  };
  showBiddingDetails = (id) => {
    const { dispatch } = this.props;
    dispatch(showLoader());
    const columns = [
      { id: "bidderTime", label: "Bidding Date" },
      { id: "value", label: "Bidding Amount" },
      { id: "bidderName", label: "Bidding Dealer" },
      { id: "storeName", label: "Store Name" },
    ];
    getBiddingDetails(id).then((apiResponse) => {
      if (apiResponse.isValid) {
        // const data = apiResponse.auctionBidderInfoList.map(bidder => {
        //   bidder.biddeTime = getDate(bidder.biddeTime)
        //   bidder.value = getAmount(bidder.value)
        //   return bidder
        // })
        const data = apiResponse.auctionBidderInfoList;
        this.setState({
          data,
          columns,
          isArray: true,
          title: "Bidding History",
          isOpen: true,
          cta: "Close",
          check: "bidding",
          biddingHistoryLen: apiResponse.auctionBidderInfoList
            ? apiResponse.auctionBidderInfoList.length
            : 0,
        });
      } else {
        dispatch(setNotification("danger", "Error", "No Bidding History"));
      }
      dispatch(hideLoader());
    });
  };

  goToViewSummaryPage = (id) => {
    this.props.history.push(`/bidding-dashboard/viewDeatils/${id}`);
  };

  clearRegistrationInput = () => {
    const { filters: prevFilters } = this.state;
    const { dispatch } = this.props;
    if (Object.keys(prevFilters).length) {
      this.setState({ filters: {}, status: "ALL" }, () => {
        window.scrollTo(0, 0);
        dispatch(
          biddingList({ status: "ALL", pageNum: 1, userId: getUserID() })
        );
      });
    }
  };

  handleChange = (e) => {
    this.setState({
      universalCheck: e.target.checked,
    });
  };

  dateChange = (dateType) => {};

  onRefreshStatus = () => {
    const { status, filters } = this.state;
    const { dispatch, pageNum } = this.props;
    dispatch(biddingList({ ...filters, pageNum, status, userId: getUserID() }));
  };

  render() {
    const {
      isOpen,
      biddingHistoryLen,
      openCallModel,
      callData,
      title,
      columns,
      check,
      data,
      isArray,
      open,
      openDrop,
      isModelOpen,
      openRegistration,
      status,
      cta,
      isRegistrationSearch,
      searchText,
      universalCheck,
    } = this.state;
    return (
      <Fragment>
        <h3>Bidding Details</h3>
        <BiddingFilter
          onApplyFilter={this.applyFilter}
          onClearFilters={this.clearFilters}
          onClearSearch={this.clearRegistrationInput}
          DateTypeChange={this.dateChange}
        />
        {/* <Card className="mt-3 mb-3" style={{ paddingBottom: 0 }}>
          <CardBody className="card-shadow square-border" style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              color="primary"
              onChange={(e) => this.handleChange(e)}
              checked={universalCheck}
            />
            <p style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold', marginRight: 20, marginBottom: 9 }}>Include Old Records</p>
            <SearchField
              value={searchText}
              onSearch={searchTextValue => this.setState({ searchText: searchTextValue })}
              withButton
              onEnter={this.handleSearch}
              onClick={this.handleSearch}
              onClearInput={this.handleClearFilter}
              placeholder="Search By Registration Number"
              style={{ maxWidth: 350 }}
            />
          </CardBody>
        </Card> */}
        <BiddingHeader
          // onExportFile={this.exportFile}
          onChangeStatus={this.updateStatus}
          status={status}
          onRefreshData={() => this.onRefreshStatus()}
        />
        <BiddingDataTable
          status={status}
          onStatusChange={this.updateStatusForHeader}
          onPageChange={this.handlePageChange}
          onChangeRegistrationNumber={this.changeRegistartionNumber}
          onMarkedAsDroped={this.markedAsDrop}
          onRebid={this.rebid}
          onCustomerDetails={this.showCutomerDetails}
          onBikeDetails={this.showVehicleDetails}
          onValuatorDetails={this.showValuatorDetails}
          onBidDetails={this.showBiddingDetails}
          onViewSummary={this.showSummary}
          isRegistrationSearch={isRegistrationSearch}
          onRefreshPage={() => this.refreshData()}
          biddingHistoryLen={biddingHistoryLen}
        />
        {isOpen && (
          <BiddingDataDialog
            isOpen={isOpen}
            columns={columns}
            data={data}
            status={status}
            check={check}
            isArray={isArray}
            title={title}
            onClose={this.closeDialog}
            cta={cta}
            handleCallModel={this.handleOpenCallModel}
            onGoToSummary={this.goToViewSummaryPage}
            refreshData={this.showBiddingDetails}
            onRefreshPage={() => this.refreshData()}
          />
        )}
        {open && (
          <RebidDialog
            open={open}
            data={data}
            onClose={this.closeActionDialog}
            onRefreshPage={() => this.refreshData()}
          />
        )}
        {openDrop && (
          <DropDialog
            openDrop={openDrop}
            data={data}
            onClose={this.closeDropDialog}
            onRefreshPage={() => this.refreshData()}
          />
        )}
        {openRegistration && (
          <RegistrationDialog
            openRegistration={openRegistration}
            data={data}
            onClose={this.closeRegistrationDialog}
            onRefreshPage={() => this.refreshData()}
          />
        )}
        {openCallModel && (
          <CallToCustomerDialog
            callOpen={openCallModel}
            onClose={this.handleCloseCallModel}
            rowData={callData}
            callerType="dealer"
            onRefreshPage={this.refreshData}
          />
        )}
      </Fragment>
    );
  }
}

export default connect((state) => ({ pageNum: state.biddingList.pageNum }))(
  BiddingDashboard
);
