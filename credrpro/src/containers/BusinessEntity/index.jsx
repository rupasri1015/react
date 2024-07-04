import React, { Component, Fragment } from 'react'
import AddBusinessEntity from './components/AddBusinessEntity'
import './components/businessEntity.scss'
class BusinessEntity extends Component {


    render() {
        return (
            <Fragment>
                <div id='businessEntity'>

                    <h3>Business Entity Details</h3>
                    <AddBusinessEntity />
                </div>
            </Fragment>
        );
    }

}
export default BusinessEntity;