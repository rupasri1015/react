import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Checkbox from '@material-ui/core/Checkbox';
import getPartsRequirementData from '../../../redux/actions/partsRequirementAction';
import {
  saveCheckedRow,
  removeUncheckedRow,
  unselectAll,
} from '../../../redux/actions/partRequirementTableAction';
import Pagination from 'rc-pagination';
import NoResultFound from '../../../shared/components/NoResultFound';
import localeInfo from 'rc-pagination/lib/locale/en_US';

const columns = [
  { label: 'Parts Request ID', value: 'requestId' },
  { label: 'Parts Request Date', value: 'requestDate' },
  { label: 'Registration Number', value: 'requestReason' },
  { label: 'Type', value: 'requestType' },
  { label: 'Warehouse', value: 'warehouseName' },
  { label: 'Section', value: 'section' },
  { label: 'Category', value: 'category' },
  { label: 'Part Name', value: 'sparePartName' },
  { label: 'MMV-Year', value: 'mmvYearRanges' },
  { label: 'Requested Qty', value: 'requestedQuantity' },
  { label: 'Fulfilled', value: 'fulfilledQuantity' },
  { label: 'Status', value: 'status' },
  { label: 'Order Id - Runner Name', value: 'orderIdRunnerNames' },
];

const PartsRequirementTable = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPartsRequirementData());
  }, []);
  const partsRequirementData = useSelector(
    (state) => state.partsRequirement.data
  );
  const pageNumber = useSelector((state) => state.partsRequirement.pageNumber);
  const totalPages = useSelector((state) => state.partsRequirement.totalPages);
  const fromDate = useSelector((state) => state.partsRequirement.fromDate);
  const toDate = useSelector((state) => state.partsRequirement.toDate);
  const warehouseId = useSelector(
    (state) => state.partsRequirement.warehouseId
  );
  const warehouseName = useSelector(
    (state) => state.partsRequirement.warehouseName
  );
  const searchText = useSelector((state) => state.partsRequirement.searchText);
  const filter = useSelector((state) => state.partsRequirement.filter);
  const status = useSelector((state) => state.partsRequirement.status);
  const selectedCheckBoxes = useSelector((state) => state.tableCheckBox);
  const [expandedRow, setExpandedRow] = useState(-1);

  const handlePageChange = (selectedPage) => {
    const payload = {
      pageNumber: selectedPage,
      fromDate,
      toDate,
      warehouseName,
      warehouseId,
      searchText,
      filter,
      status,
    };
    dispatch(getPartsRequirementData(payload));
  };

  const handleExpandMMV = (rowId) => {
    expandedRow === rowId ? setExpandedRow(-1) : setExpandedRow(rowId);
  };

  const handleChecked = (checked, index) => {
    const payload = {
      pageNumber,
      partRequestId: [partsRequirementData[index].requestId],
    };
    checked
      ? dispatch(saveCheckedRow(payload))
      : dispatch(removeUncheckedRow(payload));
  };

  const getAllCheckedPRs = () => {
    const tempArr = [];
    partsRequirementData.map((data) => {
      if (data.status === 'Open' || data.status === 'Partial') {
        tempArr.push(data.requestId);
      }
      return null;
    });
    return tempArr;
  };

  const getAlldataLength = () => {
    const arr = getAllCheckedPRs();
    return arr.length;
  };

  const handleAllChecked = (checked) => {
    const payload = {
      pageNumber,
      partRequestId: getAllCheckedPRs(),
    };
    checked
      ? dispatch(saveCheckedRow(payload))
      : dispatch(unselectAll(payload));
  };

  return (
    <div className="table-wraper">
      <Table size="small" style={{ width: 'max-content' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                color="primary"
                onChange={(event) => handleAllChecked(event.target.checked)}
                checked={Boolean(
                  selectedCheckBoxes[pageNumber] &&
                    partsRequirementData &&
                    partsRequirementData.length !== 0 &&
                    selectedCheckBoxes[pageNumber].length === getAlldataLength()
                )}
                disabled={warehouseId === 0 || getAlldataLength() === 0}
              />
            </TableCell>
            {columns.map((row, index) => (
              <TableCell key={index}>{row.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {partsRequirementData.map((rowData, index) => {
            return (
              <TableRow hover tabIndex={-1} key={index}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    onChange={(event) =>
                      handleChecked(event.target.checked, index)
                    }
                    checked={
                      selectedCheckBoxes[pageNumber]
                        ? selectedCheckBoxes[pageNumber].includes(
                            rowData.requestId
                          )
                        : false
                    }
                    disabled={
                      warehouseId === 0 ||
                      (rowData.status !== 'Open' &&
                        rowData.status !== 'Partial')
                    }
                  />
                </TableCell>
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
                            {rowData.mmvYearRanges.map((mmvYear, mmvIndex) => {
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
                            })}
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
                  ) : col.value === 'orderIdRunnerNames' ? (
                    <TableCell key={index1}>
                      {rowData[col.value].length === 1 ? (
                        rowData[col.value][0]
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
                          {rowData[col.value].map((id, index) => (
                            <div key={index}>{id}</div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {rowData[col.value][0]}
                          <span
                            onClick={() => handleExpandMMV(index)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                          >
                            {' +('
                              .concat(rowData[col.value].length - 1)
                              .concat(')')}
                          </span>
                        </div>
                      )}
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
      <div className="table-paginator">
        {Boolean(partsRequirementData.length) ? (
          <Pagination
            className="float-right"
            showSizeChanger={false}
            total={10 * totalPages}
            pageSize={10}
            current={pageNumber}
            locale={localeInfo}
            onChange={handlePageChange}
          />
        ) : (
          <NoResultFound />
        )}
      </div>
    </div>
  );
};

export default PartsRequirementTable;
