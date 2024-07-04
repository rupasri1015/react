import React, { Fragment } from 'react'
import { nullChecker } from '../../../core/utility/stringUtility'

const getParams = params => {
  return params.filter(param => (param.title !== 'ADD PHOTOS' && param.title !== 'ADD VIDEO'))
}

const InspectionDetails = ({ inspectionParameters }) => (
  <Fragment>
    <h1 className="tab-heading">Inspection Details</h1>
    {
      getParams(inspectionParameters).length ?
       getParams(inspectionParameters).map(params => (

        <div className="inspection-container" key={params.title}>
          <h3 className="inspection-param">{nullChecker(params.title)}</h3>
          <div className="param-derails">
            {
              params.inspectionDetails.map(paramDetail => (
                <div className="param-row" key={paramDetail.leadParameterName}>
                  <p className="param-title">{nullChecker(paramDetail.leadParameterName)}</p>
                  <p className="param-data">{paramDetail.leadParameterOptionName ? paramDetail.leadParameterOptionName : paramDetail.leadParameterValue}</p>
                </div>
              ))
            }
          </div>
        </div>
      ))
      :
      <span style={{color:"red",padding:"20px"}}>No Data</span>
    }
  </Fragment>
)

export default InspectionDetails