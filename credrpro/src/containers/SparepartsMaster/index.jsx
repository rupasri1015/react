import React, { Fragment, useState, useEffect } from 'react'
import SPMFilter from './components/SPMFilter'
import SPMTable from './components/SPMTable'
import AddSparePart from './components/AddSparePart'
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../redux/actions/loaderAction';
import {
	getAllSparePartNames,
	getAllCategories
} from '../../core/services/liveInventoryUnitServices';
import { PERMISSIONS, getRole } from '../../core/services/rbacServices';

const EMPTY_SPARE_PART = {'section' : '', 'category': '', 'sparePartName': ''};

const SparepartsMaster = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [sparePart, setSparePart] = useState(EMPTY_SPARE_PART);
	const [sparePartList, setSparePartList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
		dispatch(showLoader());
		getAllCategories()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setCategoryList(apiResponse.data);
			}
		})

		getAllSparePartNames()
		.then(apiResponse => {
			if (apiResponse.isValid) {
        setSparePartList(apiResponse.data);
        dispatch(hideLoader());
			}
		})
  }, [])

  const setName = (partName) => {
    let tempSparePart = JSON.parse(JSON.stringify(sparePart));
    tempSparePart.sparePartName = partName;
    setSparePart(tempSparePart)
  }

  const setSection = (section) => {
    let tempSparePart = JSON.parse(JSON.stringify(sparePart));
    tempSparePart.section = section;
    tempSparePart.category = '';
    setSparePart(tempSparePart)
  }

  const setCategory = (category) => {
    let tempSparePart = JSON.parse(JSON.stringify(sparePart));
    const retVal = categoryList.filter((categoryVal) => {
			return categoryVal.value ===  category;
		})
		
    tempSparePart.category = category;
    tempSparePart.section = retVal[0].section.value;;
    setSparePart(tempSparePart)
  }

  const editSparePart = (sparePart) => {
    setOpen(true);
    setSparePart(sparePart);
    setEdit(true);
  }

  const closePopUp = () => {
    setOpen(false);
    setEdit(false)
    setSparePart(EMPTY_SPARE_PART);
  }

  const openPopUp = () => {
    setOpen(true);
  }

  const resetSelections = () => {
		setSparePart(EMPTY_SPARE_PART)
	}

  return (
    <Fragment>
      <h3>Spare parts Master</h3><br/>
      {
        PERMISSIONS.SPAREPARTS_MASTER.includes(getRole())
        ?
        <AddSparePart
          popUpState={open}
          closePopUp={ closePopUp }
          openPopUp={ openPopUp }
          sparePart={ sparePart }
          sparePartList={ sparePartList }
          categoryList={ categoryList }
          setName={ setName }
          setSection={ setSection }
          setCategory={ setCategory }
          resetSelections={ resetSelections }
          edit={ edit }
        />
        : null
      }

      
      <SPMFilter/>
      <SPMTable handleEdit = {editSparePart} />
    </Fragment>
  )
}

export default SparepartsMaster;
