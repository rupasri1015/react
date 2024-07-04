import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { conversionalData } from '../../../redux/actions/conversionalFunnelAction'

class ProfDashboardFunnel extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(conversionalData())
  }

  render() {
    const { dataCount } = this.props
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-3">
            <div className="main_container">
              <div className="trapezoid ">
                <span className="text-span">{dataCount != null && dataCount.count ? dataCount.count : "0"}</span>
              </div>
              <div className="trapezoid2 ">
                <span className="text-span2">{dataCount != null && dataCount.preApproveLeadCount ? dataCount.preApproveLeadCount : '0'}</span>
              </div>
              <div className="trapezoid3 ">
                <span className="text-span3">{dataCount != null && dataCount.totalExchangeCount ? dataCount.totalExchangeCount : '0'}</span>
              </div>
              <div className="trapezoid4 ">
                <span className="text-span4">{dataCount != null && dataCount.totalWharehouseDeliveredCount ? dataCount.totalWharehouseDeliveredCount : '0'}</span>
              </div>
              <div className="triangle-down">
                <span className="text-span5">{dataCount != null && dataCount.totalRejectedCount ? dataCount.totalRejectedCount : '0'}</span>
              </div>
            </div>
          </div>
          <div className="col-md-9 my-auto ">

            <div className="d-inline pl-2 text-black circle green">Leads</div>

            <div className="d-inline pl-2 text-black circle blue">Pre-Approvals</div>

            <div className="d-inline pl-2 text-black circle yellow">Exchanges</div>

            <div className="d-inline pl-2 text-black circle purple">Warehouse Delivery</div>

            <div className="d-inline pl-2 text-black circle red">Rejected</div>
          </div>
        </div>
      </Fragment>
    )
  }
}
const mapsToProps = (state) => ({
  dataCount: state.conversionalFunnnel.performanceDashoboardCount
})
export default connect(mapsToProps)(ProfDashboardFunnel)