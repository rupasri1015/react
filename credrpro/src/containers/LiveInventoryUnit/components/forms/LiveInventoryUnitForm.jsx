import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FormPageOne from './FormPageOne';
import FormPageTwo from './FormPageTwo';
import { parseForDropDown, parseForMMVDropDown } from './utils';
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction';
import Header from '../Header';
import {
	getAllWarehouses,
	getAllVendors,
	getAllSparePartNames,
	getAllMMVYearRange,
	getAllSparePartNamesWithSection,
	getAllCategories
} from '../../../../core/services/liveInventoryUnitServices';


const LiveInventoryUnitForm = ({ history }) => {
  const dispatch = useDispatch();
	const [step, setStep] = useState('1');
	const [vendorList, setVendorList] = useState([]);
	const [sparePartList, setSparePartList] = useState([]);
	const [categoryList, setCategoryList] = useState([]);
	const [allPartsWithSection, setAllPartsWithSection] = useState([]);
	const [mmvList, setMMVList] = useState([]);
	const [wareHouseList, setWarehouseList] = useState([]);
	const [wareHouse, setWarehouse] = useState('');
	const [pageOneData, setPageOneData] = useState([{
		section: '',
		category: '',
		partName: '',
		mmvYearRange: '',
		sourceType: '',
		qty: '',
		unitPrice: '',
		modelNo: '',
	}]);
	const [pageTwoData, setPageTwoData] = useState({
		vendorName: '',
		paymentSLA: '',
		billNumber: '',
		totalAmount: '',
		date: new Date(),
		discount: '',
		gst: '',
		remark: '',
		attachedFile: []
	});

	useEffect(() => {
		setStep(1);
		
		dispatch(showLoader());
		getAllCategories()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setCategoryList(apiResponse.data);
			}
		})

		getAllWarehouses()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setWarehouseList(apiResponse.data);
			}
		})

		getAllVendors()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setVendorList(apiResponse.data);
			}
		})

		getAllSparePartNames()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setSparePartList(apiResponse.data);
			}
		})

		getAllSparePartNamesWithSection()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setAllPartsWithSection(apiResponse.data);
			}
		})

		getAllMMVYearRange()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setMMVList(apiResponse.data);
			}
		})
	}, [])

	const goToNextPage = (data) => {
		setPageOneData(data);
		setStep(2);
	}

	const goToPrevPage = (data) => {
		setPageTwoData(data)
		setStep(1);
	}

	if(categoryList.length !== 0
		&& vendorList.length !== 0
		&& sparePartList.length !== 0
		&& allPartsWithSection.length !== 0
		&& mmvList.length !== 0
		&& wareHouseList.length !== 0) {
				dispatch(hideLoader());
		}
	
	return(
		<Fragment>
			{
				categoryList.length !== 0
				&& vendorList.length !== 0
				&& sparePartList.length !== 0
				&& allPartsWithSection.length !== 0
				&& mmvList.length !== 0
				&& wareHouseList.length !== 0
				?
					step === 1
					? <FormPageOne
							goToNextPage={ goToNextPage }
							wareHouseList={ parseForDropDown(wareHouseList) }
							sparePartList={ sparePartList }
							mmvList={ parseForMMVDropDown(mmvList) }
							categoryList={ categoryList }
							tableData={pageOneData}
							wareHouse={wareHouse}
							setWarehouse={setWarehouse}
							allPartsWithSection={allPartsWithSection}
						/>
					: <FormPageTwo
							goToPrevPage={ goToPrevPage }
							history={ history }
							pageOneData={ pageOneData }
							pageTwoData={ pageTwoData }
							vendorList={ parseForDropDown(vendorList) }
							wareHouse={wareHouse}
							setPageTwoData={setPageTwoData}
						/>
					:	<Header toWrite='Fulfil Spare Part Details'/>
			}
		</Fragment>
	)
}

export default LiveInventoryUnitForm;