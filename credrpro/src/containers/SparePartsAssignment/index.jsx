import React, { Fragment } from 'react';
import Header from './components/Header';
import StatusButton from './components/StatusButtons';
import SparePartsAssignmentTable from './components/SparePartsAssignmentTable';
import SparePartsAssignmentFilter from './components/SparePartsAssignmentFilter';

const SparePartsAssignment = () => {
  return (
    <Fragment>
      <Header toWrite="Spare Parts Requisitions" />
      <SparePartsAssignmentFilter />
      <StatusButton />
      <SparePartsAssignmentTable />
    </Fragment>
  );
};

export default SparePartsAssignment;
