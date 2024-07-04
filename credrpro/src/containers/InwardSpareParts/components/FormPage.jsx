import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';
import { parseForDropDown } from '../../LiveInventoryUnit/components/forms/utils';
import { getAllWarehouses } from '../../../core/services/liveInventoryUnitServices';
import { getRunnerList } from '../../../core/services/partsRequirementServices';
import { getAllAssignmentForRunner } from '../../../core/services/myAssignmentsServices';
import { getOrderDetails } from '../../../core/services/partsOrderHistoryServices';
import InwardSparePartTable from './InwardSparePartTable';
import BillingPage from './BillingPage';
import {
  isPositiveInt,
  isPositiveFloat,
  roundUptoTwoDecimal,
} from '../../LiveInventoryUnit/components/forms/utils';
import { getRepairRequestId } from '../../SparePartsAssignment/components/form/utils';
import {
  getWarehouseID,
  getWarehouseName,
  getRole,
  getUserID,
  getUserName,
} from '../../../core/services/rbacServices';

const FormPage = ({ history }) => {
  const dispatch = useDispatch();
  const [wareHouse, setWarehouse] = useState('');
  const [wareHouseList, setWarehouseList] = useState([]);
  const [runnerList, setRunnerList] = useState([]);
  const [runner, setRunner] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [orderIdList, setOrderIdList] = useState([]);
  const [orderIdAvailable, setOrderIdAvailable] = useState(false);
  const [partData, setPartData] = useState({});
  const [billingData, setBillingData] = useState({
    vendorName: '',
    paymentSLA: '',
    billNumber: '',
    totalAmount: '',
    date: new Date(),
    givenAmount: '',
    returnedAmount: '',
    remark: '',
    attachedFile: [],
  });
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    const orderId = getRepairRequestId(window.location.href);
    if (orderId) {
      dispatch(showLoader());
      getOrderDetails(orderId).then((apiResponse) => {
        if (apiResponse.isValid) {
          dispatch(hideLoader());
          setPartData(getPartData(apiResponse.data));
          setOrderIdAvailable(true);
        } else {
          dispatch(
            setNotification(
              'danger',
              'Order details not loaded',
              apiResponse.message
            )
          );
          dispatch(hideLoader());
        }
      });
    }

    dispatch(showLoader());

    const userWarehouseId = getWarehouseID();
    if (userWarehouseId === 0) {
      getAllWarehouses().then((apiResponse) => {
        if (apiResponse.isValid) {
          let warehouses = parseForDropDown(apiResponse.data);
          setWarehouseList(
            warehouses.filter((wareHouse) => {
              return wareHouse.value !== 0;
            })
          );
        } else {
          setWarehouseList([]);
          dispatch(
            setNotification(
              'danger',
              'Warehouse list not loaded',
              apiResponse.message
            )
          );
          dispatch(hideLoader());
        }
      });
    } else {
      setWarehouse({ value: userWarehouseId, label: getWarehouseName() });
      setWarehouseList([]);
    }

    if (getRole() === 'SPARE_PARTS_RUNNER') {
      setRunnerList([]);
      handleSelectRunner({ value: getUserID(), label: getUserName() });
    } else {
      getRunnerList(userWarehouseId).then((apiResponse) => {
        if (apiResponse.isValid) {
          setRunnerList(parseForDropDown(apiResponse.runners));
          dispatch(hideLoader());
        } else {
          setRunnerList([]);
          dispatch(
            setNotification(
              'danger',
              'Runer list not loaded',
              apiResponse.message
            )
          );
          dispatch(hideLoader());
        }
      });
    }
  }, []);

  const handleChangeWarehouse = (selectedWarehouse) => {
    dispatch(showLoader());
    getRunnerList(selectedWarehouse.value).then((apiResponse) => {
      if (apiResponse.isValid) {
        setRunnerList(parseForDropDown(apiResponse.runners));
        dispatch(hideLoader());
      } else {
        setRunnerList([]);
        dispatch(
          setNotification(
            'danger',
            'Runer list not loaded',
            apiResponse.message
          )
        );
        dispatch(hideLoader());
      }
    });
    setRunner('');
    setWarehouse(selectedWarehouse);
  };

  const getTotalPrice = (tempPartData, index) => {
    const { fulfilledQuantity, estimatedUnitPrice, gst, actualUnitPrice } =
      tempPartData.items[index];
    const price =
      partData.status === 'InProgress'
        ? fulfilledQuantity * estimatedUnitPrice +
          (fulfilledQuantity * estimatedUnitPrice * gst) / 100.0
        : fulfilledQuantity * actualUnitPrice +
            (fulfilledQuantity * actualUnitPrice * gst) / 100.0 || 0;
    return price.toFixed(2);
  };

  const getOrderIDDropdown = (allOrders) => {
    if (allOrders) {
      return allOrders.map((order) => {
        return { label: order.orderId, value: order.orderId };
      });
    } else {
      return [];
    }
  };

  const handleSelectRunner = (val) => {
    dispatch(showLoader());
    getAllAssignmentForRunner(val.value).then((apiResponse) => {
      if (apiResponse.isValid) {
        setRunner(val);
        dispatch(hideLoader());
        setOrderIdList(getOrderIDDropdown(apiResponse.data));
      } else {
        dispatch(
          setNotification(
            'danger',
            'Assignments not loaded',
            apiResponse.message
          )
        );
        dispatch(hideLoader());
      }
    });
  };

  const getPartData = (data) => {
    const tempPartData = JSON.parse(JSON.stringify(data));
    tempPartData.items &&
      tempPartData.items.map((item, index) => {
        if (!item.fulfilledQuantity) {
          tempPartData.items[index]['fulfilledQuantity'] = '';
        }
        if (!item.estimatedUnitPrice) {
          tempPartData.items[index]['estimatedUnitPrice'] = 0;
        }
        if (!item.gst) {
          tempPartData.items[index]['gst'] = 0;
        }
        if (!item.sourceType) {
          tempPartData.items[index]['sourceType'] = 'oem';
        }
        if (!item.modelNumber) {
          tempPartData.items[index]['modelNumber'] = '';
        }
        tempPartData.items[index]['totalPrice'] = getTotalPrice(
          tempPartData,
          index
        );
        return null;
      });
    return tempPartData;
  };

  const handleSelectOrderId = (val) => {
    setSelectedOrderId(val);
    dispatch(showLoader());
    getOrderDetails(val.value).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(hideLoader());
        setPartData(getPartData(apiResponse.data));
      } else {
        dispatch(
          setNotification(
            'danger',
            'Order details not loaded',
            apiResponse.message
          )
        );
        dispatch(hideLoader());
      }
    });
  };

  const handleChangeFulfilledQty = (qty, index, gst, rowData) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    if (
      (isPositiveInt(qty) && Number(qty) <= rowData.requestedQuantity + 10) ||
      qty === ''
    ) {
      tempPartData.items[index].fulfilledQuantity = qty;
      tempPartData.items[index]['gst'] = gst;
      tempPartData.items[index]['totalPrice'] = getTotalPrice(
        tempPartData,
        index
      );

      let remainingQty = qty;
      for (let i = 0; i < tempPartData.items[index]['prDetails'].length; i++) {
        const reqQty =
          tempPartData.items[index]['prDetails'][i].requestedQuantity;
        if (remainingQty >= reqQty) {
          tempPartData.items[index]['prDetails'][i].fulfilledQuantity = reqQty;
          tempPartData.items[index]['prDetails'][i].tempQty = reqQty;
        } else {
          tempPartData.items[index]['prDetails'][i].fulfilledQuantity =
            remainingQty;
          tempPartData.items[index]['prDetails'][i].tempQty = remainingQty;
        }
        remainingQty =
          remainingQty -
          tempPartData.items[index]['prDetails'][i].fulfilledQuantity;
      }

      setPartData(tempPartData);
    }
  };

  const reassignQuantities = (itemIndex) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    tempPartData.items[itemIndex]['prDetails'].map((pr, index) => {
      tempPartData.items[itemIndex]['prDetails'][index]['tempQty'] =
        pr.fulfilledQuantity;
      return null;
    });
    setPartData(tempPartData);
  };

  const handleChangeUnitPrice = (price, index, gst) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    if (isPositiveFloat(price) || price === '') {
      tempPartData.items[index].estimatedUnitPrice = roundUptoTwoDecimal(price);
      tempPartData.items[index]['gst'] = gst;
      tempPartData.items[index]['totalPrice'] = getTotalPrice(
        tempPartData,
        index
      );
      setPartData(tempPartData);
    }
  };

  const handleChangeActualUnitPrice = (price, index, gst) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    if (isPositiveFloat(price) || price === '') {
      tempPartData.items[index].actualUnitPrice = roundUptoTwoDecimal(price);
      tempPartData.items[index]['gst'] = gst;
      tempPartData.items[index]['totalPrice'] = getTotalPrice(
        tempPartData,
        index
      );
      setPartData(tempPartData);
    }
  };

  const handleGST = (gst, index) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    tempPartData.items[index].gst = gst;
    tempPartData.items[index]['totalPrice'] = getTotalPrice(
      tempPartData,
      index
    );
    setPartData(tempPartData);
  };

  const handleSourceType = (source, index) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    tempPartData.items[index].sourceType = source;
    setPartData(tempPartData);
  };

  const handlePRallocation = (value, itemIndex, prIndex) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    if (
      (isPositiveInt(value) &&
        value <=
          tempPartData.items[itemIndex]['prDetails'][prIndex][
            'requestedQuantity'
          ]) ||
      value === ''
    ) {
      tempPartData.items[itemIndex]['prDetails'][prIndex]['tempQty'] = value;
      setPartData(tempPartData);
    }
  };

  const handleIndividualAllocation = (itemIndex) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    tempPartData.items[itemIndex]['prDetails'].forEach((pr, index) => {
      tempPartData.items[itemIndex]['prDetails'][index]['fulfilledQuantity'] =
        pr.tempQty;
    });
    setPartData(tempPartData);
  };

  const handleChangeModelNo = (modelNumber, index) => {
    const tempPartData = JSON.parse(JSON.stringify(partData));
    tempPartData.items[index].modelNumber = modelNumber;
    setPartData(tempPartData);
  };

  const renderInwardSpareParts = () => {
    if (!Object.keys(partData).length) return null;

    return (
      <InwardSparePartTable
        tableData={partData}
        handleChangeFulfilledQty={handleChangeFulfilledQty}
        handleChangeUnitPrice={handleChangeUnitPrice}
        handleChangeActualUnitPrice={handleChangeActualUnitPrice}
        handleGST={handleGST}
        setPageNo={setPageNo}
        handlePRallocation={handlePRallocation}
        reassignQuantities={reassignQuantities}
        handleIndividualAllocation={handleIndividualAllocation}
        handleSourceType={handleSourceType}
        handleChangeModelNo={handleChangeModelNo}
        history={history}
      />
    );
  };

  return pageNo === 1 ? (
    <>
      <div
        style={{ display: 'flex', flexDirection: 'row', marginBottom: '1em' }}
      >
        <div style={{ marginRight: '0.5em', width: '33%' }}>
          {orderIdAvailable ? (
            <div
              style={{
                border: '1px solid gray',
                fontWeight: 'bold',
                padding: '0.5em',
              }}
            >
              Warehouse: {partData.warehouseName}
            </div>
          ) : (
            <Select
              options={wareHouseList}
              classNamePrefix="city-dropdown"
              placeholder="Select Warehouse"
              onChange={(val) => handleChangeWarehouse(val)}
              value={wareHouse}
              // isDisabled={true}
            />
          )}
        </div>
        <div style={{ width: '33%', marginRight: '0.5em' }}>
          {orderIdAvailable ? (
            <div
              style={{
                border: '1px solid gray',
                fontWeight: 'bold',
                padding: '0.5em',
              }}
            >
              Runner Name: {partData.runnerName}
            </div>
          ) : (
            <Select
              options={runnerList}
              classNamePrefix="city-dropdown"
              placeholder="Select Runner Name"
              onChange={(val) => handleSelectRunner(val)}
              value={runner}
            />
          )}
        </div>
        <div style={{ width: '33%' }}>
          {orderIdAvailable ? (
            <div
              style={{
                border: '1px solid gray',
                fontWeight: 'bold',
                padding: '0.5em',
              }}
            >
              Order Id: {partData.orderId}
            </div>
          ) : (
            <Select
              options={orderIdList}
              classNamePrefix="city-dropdown"
              placeholder="Select Order Id"
              onChange={(val) => handleSelectOrderId(val)}
              value={selectedOrderId}
            />
          )}
        </div>
      </div>
      <h4 style={{ marginBottom: '1em' }}>Spare Part Details</h4>
      {renderInwardSpareParts()}
    </>
  ) : (
    <BillingPage
      setPageNo={setPageNo}
      pageOneData={partData}
      pageTwoData={billingData}
      setPageTwoData={setBillingData}
      history={history}
    />
  );
};

export default FormPage;
