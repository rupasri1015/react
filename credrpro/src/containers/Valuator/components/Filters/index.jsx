import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import SearchField from '../../../../shared/components/form/Search'
import CityDropDown from '../../../../shared/components/form/CityDropDown'
import { getUserID, getRole } from '../../../../core/services/rbacServices'
import { getDocQcCities } from '../../../../core/services/miscServices'
import DropDown from '../../../../shared/components/form/DropDown'

const ValuatorFilter = ({ onSearch, onCityChange, onEnter, currentCity, currentSearch, onClearFilters }) => {

  const [cityList, setCityList] = useState([])

  useEffect(() => {
    if (getRole() === 'PRO_BID') {
    let getCityList = []
    getDocQcCities(getUserID())
      .then(apiResponse => {
        if (apiResponse.isValid && apiResponse.cityList && apiResponse.cityList.length) {
          getCityList = apiResponse.cityList.map(city => {
            return {
              value: city.cityId,
              label: city.cityName
            }
          })
          setCityList(getCityList)
        }
      })
    }
  }, [])

  return (
    <div className='pending-inventory-filter-container mt-3'>
      <SearchField
        value={currentSearch}
        onSearch={onSearch}
        onEnter={onEnter}
        placeholder="Search By Keyword"
        className="dropdown-wraper"
      />
      {
        getRole() !== 'PRO_BID' ?
          <CityDropDown
            onCityChange={onCityChange}
            value={currentCity}
            className="dropdown-wraper"
          /> :
          <DropDown
            placeholder="Select City"
            onChange={onCityChange}
            options={cityList}
            value={currentCity}
            className="dropdown-wraper"
          />
      }
      <Link className="btn btn-success rounded no-margin" to="/valuator/add">+ Add Valuator</Link>
      <Button className="rounded no-margin" type="button" onClick={onClearFilters}>Clear</Button>
    </div>
  )
}

export default ValuatorFilter