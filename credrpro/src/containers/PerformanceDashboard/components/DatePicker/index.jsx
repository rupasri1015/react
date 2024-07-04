import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import DatePicker from '../../../../shared/components/form/DatePicker'

const initialState = {
    fromDate: null,
    toDate: null
}
class Datepicker extends Component {
    state = initialState


    render() {
        const { dateType, fromDateValue, toDateValue } = this.props

        const placeHolder =
            (dateType != null && dateType.value === "leadCreatedDate") ? "Lead Date" :
                (dateType != null && dateType.value === "exchangeDate") ? "Exchange Date" :
                    (dateType != null && dateType.value === "PaymentDate") ? "Payment Date" : "Select Date"


        return (
            < Fragment >
                {dateType != null && (dateType.value === "leadCreatedDate" || dateType.value === "exchangeDate" || dateType.value === "paymentDate") ?
                    <Fragment>
                        <div className="from-date">
                            <p>From</p>
                            <DatePicker
                                onDateChange={this.props.fromDate}
                                max={toDateValue}
                                startDate={fromDateValue}
                                placeholder={placeHolder}
                                id="datePicker"

                            />
                        </div >
                        <div className="from-date">
                            <p>To</p>
                            <DatePicker
                                onDateChange={this.props.toDate}
                                min={fromDateValue}
                                startDate={toDateValue}
                                placeholder={placeHolder}
                                id="datePicker"
                            />
                        </div>
                    </Fragment>
                    : null}
            </Fragment>
        )
    }

}

export default withRouter(connect()(Datepicker))