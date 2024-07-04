import React, { Fragment } from 'react'
import MMVHeader from './components/Header'
import AddMMVTable from './components/AddMMVTable'
import AddNewMMV from './components/AddNewMMV'
import MMVFilter from './components/MMVFilter'
import { Button } from 'reactstrap';
import { PERMISSIONS, getRole } from '../../core/services/rbacServices';
import MenuItem from '@material-ui/core/MenuItem';

const MMVManagement = () => {

	return (
		<Fragment>
			<MMVHeader />
			{
				PERMISSIONS.SPAREPARTS_MASTER.includes(getRole())
					?
					<AddNewMMV button={Button} />
					: null
			}
			<MMVFilter />
			<AddMMVTable />
		</Fragment>
	)
}

export default MMVManagement;