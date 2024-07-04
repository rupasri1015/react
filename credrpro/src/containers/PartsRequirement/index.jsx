import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Header from './components/Header';
import { parseForDropDown } from '../LiveInventoryUnit/components/forms/utils';
import { getAllWarehouses } from '../../core/services/liveInventoryUnitServices';
import PartsRequirementFilter from './components/PartsRequirementsFilter';
import PartsRequirementTable from './components/PartsRequirementTable';
import StatusButton from './components/StatusButtons';
import getPartsRequirementData from '../../redux/actions/partsRequirementAction';
import { unselectAll } from '../../redux/actions/partRequirementTableAction';
import { PERMISSIONS, getRole } from '../../core/services/rbacServices';
import {
  getWarehouseID,
  getWarehouseName,
} from '../../core/services/rbacServices';

const PartsRequirement = ({ history }) => {
  const dispatch = useDispatch();
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [warehouseNum, setWarehouseNum] = useState({ value: 0, label: 'All' });
  const fromDate = useSelector((state) => state.partsRequirement.fromDate);
  const toDate = useSelector((state) => state.partsRequirement.toDate);
  const searchText = useSelector((state) => state.partsRequirement.searchText);
  const filter = useSelector((state) => state.partsRequirement.filter);
  const status = useSelector((state) => state.partsRequirement.status);

  useEffect(() => {
    const userWarehouseId = getWarehouseID();
    if (userWarehouseId === 0) {
      setWarehouseNum({ value: 0, label: 'Select Warehouses' });
      getAllWarehouses().then((apiResponse) => {
        if (apiResponse.isValid) {
          setAllWarehouses(parseForDropDown(apiResponse.data));
        }
      });
    } else {
      setWarehouseNum({ value: userWarehouseId, label: getWarehouseName() });
    }
  }, []);

  const handleChangeWarehouse = (warehouse) => {
    setWarehouseNum(warehouse);
    dispatch(unselectAll({ pageNumber: 0 }));
    dispatch(
      getPartsRequirementData({
        pageNumber: 1,
        fromDate,
        toDate,
        filter,
        searchText,
        warehouseId: warehouse.value,
        warehouseName: warehouse.label,
        status,
      })
    );
  };

  return (
    <Fragment>
      <Header toWrite="Spare Parts Assignment" />
      <div style={{ display: 'flow-root', flexDirection: 'row' }}>
        {PERMISSIONS.PARTS_REQUIREMENT.includes(getRole()) &&
        getRole() !== 'SPARE_PARTS_EXECUTIVE' ? (
          <Link
            className="btn btn-success rounded no-margin"
            to="/partsRequirement/add"
          >
            Create New Spare Part(s) Requisitions
          </Link>
        ) : null}

        <div style={{ width: '300px', float: 'right' }}>
          <Select
            float="right"
            options={allWarehouses}
            classNamePrefix="city-dropdown"
            placeholder="Select Warehouse"
            onChange={(warehouse) => handleChangeWarehouse(warehouse)}
            value={warehouseNum}
          />
        </div>
      </div>
      <PartsRequirementFilter />
      <StatusButton history={history} />
      <PartsRequirementTable />
    </Fragment>
  );
};

export default PartsRequirement;
