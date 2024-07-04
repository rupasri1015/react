import React, { useState, useEffect } from 'react'
import SearchField from '../../../shared/components/form/Search';
import { Button } from 'reactstrap';
import DropDown from '../../../shared/components/form/DropDown';
import { listCities } from '../../../core/services/miscServices';
import { getUserCityList } from '../../../core/services/userInfoStorageServices';

import { getUserID } from '../../../core/services/rbacServices';
const FilterComponent = (({ handleDropdown, userType }) => {
	const [cites, setCites] = useState(null)

	useEffect(() => {
		let getCityList = []
		let sortedCities=[]
		let userCityList = getUserCityList().split(",")
		listCities()
			.then(apiResponse => {
				if (apiResponse.isValid) {
					getCityList = apiResponse.cityList.map(city => {
						
								return {
									value: city.cityId,
									label: city.cityName
								}
						

					})

					getCityList.map((item)=>{
						userCityList.map((i)=>{
							if(item.value==i)
							{
								sortedCities.push({
									value: item.value,
									label: item.label
							})
							}
						})
					})
					setCites(sortedCities)
				}
			});
	}, [])

	const handleChange = (e) => {
		let payload = {}
		payload.centralUserId = getUserID();
		payload.userCityList = e.value
		payload.userTypeName = userType
		handleDropdown(payload)
	}
	return (
		<div>

			<div className="pending-inventory-filter-container mt-3">
				<div className="filter-title">Filters</div>
				<DropDown
					onChange={handleChange}
					options={cites}
					placeholder="Select City "
					className="number-search with-margin"
				/>
			</div>

		</div>
	)
})
export default FilterComponent