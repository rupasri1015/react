import React, { Component } from 'react'
import AuditCallsForm from './components/AuditForm'
import { getAuditInfo } from '../../core/services/miscServices'
import { getUserID } from '../../core/services/rbacServices'
import { connect } from 'react-redux'

class AuditCalls extends Component{

    render(){
        return(
            <div>
                <h3>Audit Calls</h3>
                <AuditCallsForm 
                />
            </div>
        )
    }
}

export default connect()(AuditCalls)
