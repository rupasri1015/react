import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { setNotification } from '../../../redux/actions/notificationAction';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import Header from './Header';
import { getRepairRequestId } from '../../SparePartsAssignment/components/form/utils';
import {
  getOrderDetails,
  updatePartsOrder,
  discardPartOrder,
} from '../../../core/services/partsOrderHistoryServices';
import { getUserID } from '../../../core/services/rbacServices';
import {
  parseForDropDown,
  isPositiveInt,
} from '../../LiveInventoryUnit/components/forms/utils';
import {
  getRunnerList,
  getVendorList,
} from '../../../core/services/partsRequirementServices';
import { PERMISSIONS, getRole } from '../../../core/services/rbacServices';

const columns = [
  { label: 'Order Item ID', value: 'orderItemId' },
  { label: 'Part Req IDs', value: 'requestIds' },
  { label: 'Registration Number', value: 'registrationNumbers' },
  { label: 'Section', value: 'section' },
  { label: 'Categoty', value: 'category' },
  { label: 'Part Name', value: 'sparePartName' },
  { label: 'MMV-Year', value: 'mmvYearRanges' },
  { label: 'Rqst Qty', value: 'requestedQuantity' },
  { label: 'Estimated Unit Price', value: 'estimatedUnitPrice' },
];

const PartsOrderHistoryDetails = ({ history }) => {
  const dispatch = useDispatch();
  const [orderDetailsData, setOrderDetailsData] = useState({});
  const [runnerList, setRunnerList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [runner, setRunner] = useState('');
  const [vendor, setVendor] = useState('');
  const [expandedRow, setExpandedRow] = useState(-1);
  const [popUpOpen, setPopUpOpen] = useState(false);

  useEffect(() => {
    const orderId = getRepairRequestId(window.location.href);
    dispatch(showLoader());

    getOrderDetails(orderId).then((apiResponse) => {
      if (apiResponse.isValid) {
        const {
          warehouseId,
          runnerId,
          runnerName,
          runnerMobile,
          vendorId,
          vendorName,
        } = apiResponse.data;

        getRunnerList(warehouseId) //static value for testing only
          .then((apiResponse) => {
            if (apiResponse.isValid) {
              setRunnerList(parseForDropDown(apiResponse.runners));
            } else {
              setRunnerList([]);
              dispatch(hideLoader());
            }
          });

        getVendorList(warehouseId).then((apiResponse) => {
          if (apiResponse.isValid) {
            setVendorList(parseForDropDown(apiResponse.data));
          } else {
            setVendorList([]);
            dispatch(hideLoader());
          }
        });

        setOrderDetailsData(apiResponse.data);
        setRunner({
          value: runnerId,
          label: runnerName,
          mobileNumber: runnerMobile,
        });
        setVendor({ value: vendorId, label: vendorName });
      } else {
        dispatch(hideLoader());
        setOrderDetailsData({});
      }
    });
  }, []);

  const handleExpandMMV = (rowId) => {
    expandedRow === rowId ? setExpandedRow(-1) : setExpandedRow(rowId);
  };

  const handleUnitPrice = (val, index) => {
    let tempOrderDetailsData = JSON.parse(JSON.stringify(orderDetailsData));
    if (isPositiveInt(val) || val === '') {
      tempOrderDetailsData.items[index].estimatedUnitPrice = val;
      setOrderDetailsData(tempOrderDetailsData);
    }
  };

  const handleUpdateOrder = () => {
    const userId = getUserID();
    const { orderId, items } = orderDetailsData;
    let payload = {
      userId,
      orderId,
      runnerId: runner.value,
      runnerMobile: runner.mobileNumber,
      runnerName: runner.label,
      vendorId: vendor.value,
      vendorName: vendor.label,
      items: items.map((item) => {
        const { orderItemId, requestedQuantity, estimatedUnitPrice } = item;
        return {
          id: orderItemId,
          quantity: requestedQuantity,
          estimatedPrice: estimatedUnitPrice,
        };
      }),
    };
    dispatch(showLoader());
    updatePartsOrder(payload).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(hideLoader());
        dispatch(setNotification('success', 'Order Updated Successfully', ''));
        history.push('/partsOrderHistory');
      } else {
        dispatch(hideLoader());
        dispatch(
          setNotification('danger', 'Order not updated', apiResponse.message)
        );
      }
    });
  };

  const handleDiscardOrder = () => {
    setPopUpOpen(false);
    dispatch(showLoader());
    discardPartOrder(orderDetailsData.orderId).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(hideLoader());
        dispatch(setNotification('success', 'Order Updated Successfully', ''));
        history.push('/partsOrderHistory');
      } else {
        dispatch(hideLoader());
        dispatch(
          setNotification('danger', 'Order not discarded', apiResponse.message)
        );
      }
    });
  };

  const handlePopUpOpen = () => {
    setPopUpOpen(true);
  };

  const handlePopUpClose = () => {
    setPopUpOpen(false);
  };

  const dummyClick = () => {};

  if (runnerList.length !== 0 && vendorList.length !== 0) {
    dispatch(hideLoader());
  }

  const isAllInputFilled = () => {
    const items = orderDetailsData.items || [];
    const allPriceArr = items.map((item) => item.estimatedUnitPrice);
    return !allPriceArr.includes('0') && !allPriceArr.includes('');
  };

  return (
    <>
      <Dialog
        open={popUpOpen}
        onClose={handlePopUpClose}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          Are you sure that you want to discard the order ?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handlePopUpClose}
            color="secondary"
            className="rounded no-margin"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDiscardOrder}
            color="danger"
            className="rounded no-margin"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Header toWrite="Spare Parts Order Details" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '33%', marginRight: '0.5em' }}>
          <Select
            classNamePrefix="city-dropdown"
            value={{
              label: orderDetailsData.warehouseName,
              value: orderDetailsData.warehouseId,
            }}
            isDisabled={
              orderDetailsData.status !== 'New' ||
              !PERMISSIONS.PARTS_ORDER_HISTORY.includes(getRole())
            }
          />
        </div>
        <div style={{ width: '33%', marginRight: '0.5em' }}>
          <Select
            float="right"
            options={runnerList}
            classNamePrefix="city-dropdown"
            placeholder="Select Runner Name"
            onChange={(val) => setRunner(val)}
            value={runner}
            isDisabled={
              orderDetailsData.status !== 'New' ||
              !PERMISSIONS.PARTS_ORDER_HISTORY.includes(getRole())
            }
          />
        </div>
        <div style={{ width: '33%' }}>
          <Select
            float="right"
            options={vendorList}
            classNamePrefix="city-dropdown"
            placeholder="Select Vendor List"
            onChange={(val) => setVendor(val)}
            value={vendor}
            isDisabled={
              orderDetailsData.status !== 'New' ||
              !PERMISSIONS.PARTS_ORDER_HISTORY.includes(getRole())
            }
          />
        </div>
      </div>

      <Card className="pending-inventory-header">
        <CardBody className="card-shadow square-border">
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <div style={{ width: '33%' }}>
              Order Id: {orderDetailsData.orderId}
            </div>
            <div style={{ width: '33%' }}>
              Order Status: {orderDetailsData.status}
            </div>
            <div style={{ width: '33%' }}>
              Order Date: {orderDetailsData.orderDate}
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="table-wraper">
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((row, index) => (
                <TableCell key={index}>{row.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Boolean(orderDetailsData.items) &&
              orderDetailsData.items.map((rowData, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    {columns.map((col, index1) => {
                      return col.value === 'mmvYearRanges' ? (
                        <TableCell key={index1}>
                          {rowData.mmvYearRanges &&
                          rowData.mmvYearRanges.length !== 0 ? (
                            rowData.mmvYearRanges.length === 1 ? (
                              rowData.mmvYearRanges[0]
                            ) : expandedRow === index ? (
                              <div
                                onClick={() => handleExpandMMV(index)}
                                style={{
                                  cursor: 'pointer',
                                  color: 'teal',
                                  height: '9.3em',
                                  overflow: 'scroll',
                                }}
                              >
                                {rowData.mmvYearRanges.map(
                                  (mmvYear, mmvIndex) => {
                                    return (
                                      <div
                                        key={mmvIndex}
                                        style={{
                                          border: '1px solid gray',
                                          borderRadius: '3px',
                                          marginBottom: '0.1em',
                                        }}
                                      >
                                        {mmvYear ? (
                                          <div>
                                            {mmvYear.slice(
                                              0,
                                              mmvYear.length - 9
                                            )}
                                            <br />
                                            {mmvYear.slice(
                                              mmvYear.length - 9,
                                              mmvYear.length
                                            )}
                                          </div>
                                        ) : null}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            ) : (
                              <div>
                                {rowData.mmvYearRanges[0].slice(
                                  0,
                                  rowData.mmvYearRanges[0].length - 9
                                )}
                                <br />
                                {rowData.mmvYearRanges[0].slice(
                                  rowData.mmvYearRanges[0].length - 9,
                                  rowData.mmvYearRanges[0].length
                                )}{' '}
                                <span
                                  onClick={() => handleExpandMMV(index)}
                                  style={{ cursor: 'pointer', color: 'blue' }}
                                >
                                  +({rowData.mmvYearRanges.length - 1})
                                </span>
                              </div>
                            )
                          ) : null}
                        </TableCell>
                      ) : col.value === 'estimatedUnitPrice' ? (
                        <TableCell key={index1}>
                          <input
                            type="text"
                            value={rowData[col.value]}
                            disabled={
                              orderDetailsData.status !== 'New' ||
                              !PERMISSIONS.PARTS_ORDER_HISTORY.includes(
                                getRole()
                              )
                            }
                            onChange={(event) =>
                              handleUnitPrice(event.target.value, index)
                            }
                          />
                        </TableCell>
                      ) : col.value === 'requestIds' ? (
                        <TableCell key={index1}>
                          {rowData[col.value].map((id, index2) => (
                            <ul key={index2}>{id}</ul>
                          ))}
                        </TableCell>
                      ) : (
                        <TableCell key={index1}>{rowData[col.value]}</TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      {PERMISSIONS.PARTS_ORDER_HISTORY.includes(getRole()) ? (
        <>
          <Button
            color={
              orderDetailsData.status === 'New' && isAllInputFilled()
                ? 'success'
                : 'secondary'
            }
            type="button"
            className="rounded no-margin"
            onClick={
              orderDetailsData.status === 'New' && isAllInputFilled()
                ? handleUpdateOrder
                : dummyClick
            }
            style={{ float: 'right', margin: '1em' }}
          >
            Update Order
          </Button>
          <Button
            color={orderDetailsData.status === 'New' ? 'success' : 'secondary'}
            type="button"
            className="rounded no-margin"
            onClick={
              orderDetailsData.status === 'New' ? handlePopUpOpen : dummyClick
            }
            style={{ float: 'right', margin: '1em' }}
          >
            Discard Order
          </Button>
        </>
      ) : null}

      <Link
        className="btn btn-success rounded no-margin"
        to="/partsOrderHistory"
        style={{ margin: '1em' }}
      >
        Back
      </Link>
    </>
  );
};

export default PartsOrderHistoryDetails;
