import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Select from 'react-select';
import { Button } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { saveInwardingParts } from '../../../core/services/liveInventoryUnitServices';
import { getUserID } from '../../../core/services/rbacServices';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';

const taxDropDown = [
  { label: '0%', value: 0 },
  { label: '18%', value: 18 },
  { label: '28%', value: 28 },
];

const sourceDropDown = [
  { label: 'OEM', value: 'oem' },
  { label: 'After Market', value: 'afterMarket' },
];

const columns = [
  { label: 'Order Item ID', value: 'orderItemId' },
  { label: 'Section', value: 'section' },
  { label: 'Category', value: 'category' },
  { label: 'Part Name', value: 'sparePartName' },
  { label: 'Registration Number', value: 'registrationNumbers' },
  { label: 'MMV - Year', value: 'mmvYearRanges' },
  { label: 'Requested Qty', value: 'requestedQuantity' },
  { label: 'Fulfilled Qty', value: 'fulfilledQuantity' },
  { label: 'Provisional Unit Price', value: 'estimatedUnitPrice' },
  { label: 'Actual Unit Price', value: 'actualUnitPrice' },
  { label: 'GST', value: 'gst' },
  { label: 'Total Price', value: 'totalPrice' },
  { label: 'Source Type', value: 'sourceType' },
  { label: 'Model No', value: 'modelNumber' },
  { label: 'Allocate', value: 'allocate' },
];

const popUpColumns = [
  { label: 'Part Req Id', value: 'id' },
  { label: 'Req Reason', value: 'requestReason' },
  { label: 'Req Qty', value: 'requestedQuantity' },
  { label: 'Fulfilled Qty', value: 'tempQty' },
];

const InwardSparePartTable = (props) => {
  const dispatch = useDispatch();
  const {
    tableData,
    handleChangeFulfilledQty,
    handleChangeUnitPrice,
    handleChangeActualUnitPrice,
    handleGST,
    setPageNo,
    handlePRallocation,
    reassignQuantities,
    handleIndividualAllocation,
    handleSourceType,
    handleChangeModelNo,
  } = props;
  const [expandedRow, setExpandedRow] = useState(-1);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [gst, setGst] = useState([]);

  useEffect(() => {
    if (!gst.length) {
      const gsts = tableData.items.map((item) => {
        return { label: '0%', value: 0, orderItemId: item.orderItemId };
      });
      setGst(gsts);
    }
  });

  const handleExpandMMV = (rowId) => {
    expandedRow === rowId ? setExpandedRow(-1) : setExpandedRow(rowId);
  };

  const _handleGST = (selectedGst, index, orderId) => {
    const indexToModify = gst.findIndex((obj) => obj.orderItemId === orderId);
    const newGstObj = gst;
    newGstObj[indexToModify] = { ...selectedGst, orderItemId: orderId };
    gst[indexToModify] = { ...selectedGst, orderItemId: orderId };
    setGst(newGstObj);
    handleGST(selectedGst.value, index);
  };

  const getGst = (orderItemId) => {
    return gst.filter((item) => item.orderItemId === orderItemId)[0];
  };

  const getSourceType = (sourceType) => {
    const sourceArr = sourceDropDown.filter((source) => {
      return source.value === sourceType;
    });
    return sourceArr[0];
  };

  const handlePopUpOpen = (rowData, index) => {
    setSelectedItem(rowData);
    setSelectedIndex(index);
    setPopUpOpen(true);
  };

  const handlePopUpClose = () => {
    setPopUpOpen(false);
    reassignQuantities(selectedIndex);
  };

  const handleSubmit = () => {
    setPopUpOpen(false);
    handleIndividualAllocation(selectedIndex);
  };

  const dummyClick = () => {};

  const getAllocatedQty = () => {
    if (tableData.items && tableData.items[selectedIndex]) {
      const allocationArr = tableData.items[selectedIndex].prDetails.map((pr) =>
        parseInt(pr.tempQty)
      );
      return allocationArr.reduce((a, b) => a + b, 0);
    }
    return 0;
  };

  const checkAllFilled = () => {
    if (tableData.items) {
      const disable = tableData.items.map((item) => {
        if (
          item.totalPrice === '0.00' ||
          item.totalPrice === '' ||
          item.fulfilledQuantity === ''
        )
          return false;
      });

      if (disable.includes(true)) return false;
      return true;
    }
  };

  const saveProvisionalData = () => {
    const payload = {
      items: tableData.items.map((item) => {
        item.warehouseId = tableData.warehouseId;
        item.userId = getUserID();
        return item;
      }),
    };
    dispatch(showLoader());
    saveInwardingParts(payload).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(hideLoader());
        dispatch(setNotification('success', 'Data Added Successfully', ''));
        props.history.push('/liveInventoryUnit');
      } else {
        dispatch(
          setNotification('danger', 'Data is not added', apiResponse.message)
        );
        dispatch(hideLoader());
      }
    });
  };

  if (!gst.length) return null;

  return (
    <div className="table-wraper">
      <Dialog
        open={popUpOpen}
        onClose={handlePopUpClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <div style={{ margin: '1em', fontSize: '14px' }}>
          <span style={{ fontWeight: 'bolder', fontSize: '18px' }}>
            Order Item Id: {selectedItem.orderItemId}
          </span>
          <br />
          Part Name: {selectedItem.sparePartName}
          <br />
          MMV-Year:{' '}
          {selectedItem.mmvYearRanges &&
            selectedItem.mmvYearRanges.map((mmv, index) => {
              return <li key={index}>{mmv}</li>;
            })}
          <br />
          Fulfilled Quantity: {selectedItem.fulfilledQuantity}
          <br />
          Total Allocated Quantity:{' '}
          {isNaN(getAllocatedQty()) ? 'Enter All Values' : getAllocatedQty()}
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              {popUpColumns.map((row, index) => (
                <TableCell key={index}>{row.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.items &&
              tableData.items[selectedIndex] &&
              tableData.items[selectedIndex].prDetails.map((rowData, index) => {
                return (
                  <TableRow key={index}>
                    {popUpColumns.map((col, index1) => {
                      return col.value === 'tempQty' ? (
                        <TableCell key={index1}>
                          <input
                            disabled={
                              parseInt(selectedItem.fulfilledQuantity) ===
                                selectedItem.requestedQuantity ||
                              parseInt(selectedItem.fulfilledQuantity) === 0
                            }
                            type="text"
                            value={rowData[col.value]}
                            onChange={(event) => {
                              handlePRallocation(
                                event.target.value,
                                selectedIndex,
                                index
                              );
                            }}
                          />
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

        <DialogActions>
          {parseInt(selectedItem.fulfilledQuantity) ===
            selectedItem.requestedQuantity ||
          parseInt(selectedItem.fulfilledQuantity) === 0 ? (
            <Button
              onClick={handlePopUpClose}
              color="secondary"
              className="rounded no-margin"
              style={{ width: '5em' }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePopUpClose}
                color="secondary"
                className="rounded no-margin"
              >
                Cancel
              </Button>
              <Button
                onClick={
                  parseInt(selectedItem.fulfilledQuantity) === getAllocatedQty()
                    ? handleSubmit
                    : dummyClick
                }
                color={
                  parseInt(selectedItem.fulfilledQuantity) === getAllocatedQty()
                    ? 'success'
                    : 'secondary'
                }
                className="rounded no-margin"
              >
                Allocate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((row, index) => (
              <TableCell key={index}>{row.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {tableData.items ? (
          <TableBody>
            {tableData.items.map((rowData, index) => {
              const orderItemId = rowData.orderItemId;
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
                                          {mmvYear.slice(0, mmvYear.length - 9)}
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
                    ) : col.value === 'gst' ? (
                      <TableCell key={index1} style={{ width: '8em' }}>
                        <Select
                          options={taxDropDown}
                          classNamePrefix="city-dropdown"
                          placeholder="GST"
                          onChange={(gst) =>
                            _handleGST(gst, index, rowData.orderItemId)
                          }
                          value={getGst(orderItemId)}
                        />
                      </TableCell>
                    ) : col.value === 'fulfilledQuantity' ? (
                      <TableCell key={index1}>
                        <TextField
                          value={rowData.fulfilledQuantity}
                          disabled={tableData.status === 'NotBilled'}
                          style={{ width: '6em' }}
                          onChange={(event) =>
                            handleChangeFulfilledQty(
                              event.target.value,
                              index,
                              getGst(rowData.orderItemId).value,
                              rowData
                            )
                          }
                        />
                      </TableCell>
                    ) : col.value === 'estimatedUnitPrice' ? (
                      <TableCell key={index1}>
                        <TextField
                          value={rowData.estimatedUnitPrice}
                          disabled={tableData.status === 'NotBilled'}
                          style={{ width: '6em' }}
                          onChange={(event) =>
                            handleChangeUnitPrice(
                              event.target.value,
                              index,
                              getGst(rowData.orderItemId).value
                            )
                          }
                        />
                      </TableCell>
                    ) : col.value === 'actualUnitPrice' ? (
                      <TableCell key={index1}>
                        <TextField
                          value={
                            tableData.status === 'InProgress'
                              ? ''
                              : rowData.actualUnitPrice
                          }
                          disabled={tableData.status === 'InProgress'}
                          style={{ width: '6em' }}
                          onChange={(event) =>
                            handleChangeActualUnitPrice(
                              event.target.value,
                              index,
                              getGst(rowData.orderItemId).value
                            )
                          }
                        />
                      </TableCell>
                    ) : col.value === 'allocate' ? (
                      <TableCell key={index1}>
                        <Button
                          color={
                            parseInt(rowData.fulfilledQuantity) === 0 ||
                            parseInt(rowData.fulfilledQuantity) ===
                              rowData.requestedQuantity
                              ? 'secondary'
                              : 'success'
                          }
                          type="button"
                          className="rounded no-margin"
                          disabled={rowData.fulfilledQuantity === ''}
                          onClick={() => handlePopUpOpen(rowData, index)}
                        >
                          {parseInt(rowData.fulfilledQuantity) === 0 ||
                          parseInt(rowData.fulfilledQuantity) ===
                            rowData.requestedQuantity
                            ? 'View'
                            : col.label}
                        </Button>
                      </TableCell>
                    ) : col.value === 'sourceType' ? (
                      <TableCell key={index1} style={{ width: '8em' }}>
                        <Select
                          options={sourceDropDown}
                          classNamePrefix="city-dropdown"
                          placeholder="Source Type"
                          onChange={(sourceType) =>
                            handleSourceType(sourceType.value, index)
                          }
                          value={getSourceType(rowData.sourceType)}
                        />
                      </TableCell>
                    ) : col.value === 'modelNumber' ? (
                      <TableCell key={index1}>
                        <TextField
                          value={rowData.modelNumber}
                          disabled={tableData.status === 'NotBilled'}
                          style={{ width: '6em' }}
                          onChange={(event) =>
                            handleChangeModelNo(event.target.value, index)
                          }
                        />
                      </TableCell>
                    ) : (
                      <TableCell key={index1}>{rowData[col.value]}</TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell>Please Select "Runner Name" and "OrderId"</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Button
        color="success"
        style={{ float: 'right', margin: '1.5em 1em' }}
        type="button"
        className="rounded no-margin"
        disabled={!checkAllFilled()}
        onClick={() =>
          tableData.status === 'InProgress'
            ? saveProvisionalData()
            : setPageNo(2)
        }
      >
        {tableData.status === 'InProgress' ? 'Save' : 'Continue'}
      </Button>
    </div>
  );
};

export default InwardSparePartTable;
