import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { Button } from 'reactstrap';

class TableDrawer extends Component {

    render() {
        const { drawer, onMarkAsSold, onAssignInventory, rowInfo, showSoldMessage, showOnlyAssignInventory, showAssignText } = this.props
        return (
            <Drawer
                className={drawer}
                variant="permanent"
                transitionDuration={{ enter: 500, exit: 1000 }}
                anchor="right"
            >
                {
                    showOnlyAssignInventory ?
                        <>
                            <div className="col-md-12">
                                <h5 className='call-header'> { showAssignText ? 'Assign Bike' : 'Bike is not available/ Bike is sold'}.</h5>
                            </div>
                            <div className="col-12" style={{ padding: '10px', paddingLeft: '30px' }}>
                            <h5 >Please assign bike</h5>
                            </div>
                            <div className="col-12" style={{ padding: '10px', paddingLeft: '30px' }}>
                                <Button color="primary" type="button" className="rounded no-margin" onClick={onAssignInventory}>Assign Inventory</Button>
                            </div>
                        </>
                        :
                        !showSoldMessage ?
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className='call-header'> {rowInfo.regnum} is sold.</h5>
                                </div>
                                <div className="col-12" style={{ padding: '10px', paddingLeft: '30px' }}>
                                    <p>Please choose any other liked bike.</p>
                                </div>
                            </div> :
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className='call-header'> Start Selling: {rowInfo.regnum} </h5>
                                </div>
                                <div className="col-12" style={{ padding: '10px', paddingLeft: '30px' }}>
                                    <Button color="primary" type="button" className="rounded no-margin" onClick={onAssignInventory}>Assign Inventory</Button>
                                </div>
                                <div className="col-12" style={{ padding: '10px', paddingLeft: '30px' }}>
                                    <Button color="success" type="button" className="rounded no-margin" onClick={onMarkAsSold}>Mark as sold</Button>
                                </div>
                            </div>
                }
            </Drawer>
        )
    }
}

export default TableDrawer