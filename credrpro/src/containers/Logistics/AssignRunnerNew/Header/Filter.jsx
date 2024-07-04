import React , {useState} from 'react'
// import SearchField from '../../../../shared/components/Search'
import searchIcon from '../../../../shared/img/icons/search_icon_black.svg';
import { getAllVehiclesList } from '../../../../redux/actions/assignRunnerNewAction';
import { useDispatch, useSelector } from 'react-redux';
import { userTypeDetails } from '../../../../core/services/authenticationServices';
import SearchField from '../../../../shared/components/form/Search'

export default function Filter(props) {
  return (
    <div>
         {/* <SearchField
        value={props.searchText}
        withButton
        onSearch={props.setSearch}
        onEnter={props.onSearchText}
        onClick={props.onSearchText}
        onClearInput={props.onSearchText}
        // onClearInput={clearCheckedInput}
        placeholder="Search By Registration Number"
        icon={searchIcon}
        // className={styles.searchContainer}
        // searchFieldClass={styles.searchFieldClass}
      /> */}
      <SearchField
        value={props.searchText}
        onSearch={props.setSearch}
        withButton
        onEnter={props.onSearchText}
        onClick={props.onSearchText}
        onClearInput={props.onClearSearch}
        placeholder="Search By Registration Number"
        // style={{ maxWidth: 450 }}
      />
    </div>
  )
}
