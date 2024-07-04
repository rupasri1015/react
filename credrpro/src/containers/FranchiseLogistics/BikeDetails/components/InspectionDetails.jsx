import React, { Fragment } from 'react'
import { renderString } from '../../../../core/utility'

const getParams = params => {
  if (params) return params.filter(param => (param.title !== 'ADD PHOTOS' && param.title !== 'ADD VIDEO'))
  return []
}

const InspectionDetails = ({ inspectionParameters }) => (
  <Fragment>
    <h1 className="tab-heading">Inspection Details</h1>
    {
      getParams(inspectionParameters).length ?
        getParams(inspectionParameters).map(params => (
          <div className="inspection-container" key={params.title}>
            <h3 className="inspection-param">{renderString(params.title)}</h3>
            <div className="param-derails">
              {
                params.inspectionDetails.map(paramDetail => (
                  <div className="param-row" key={paramDetail.leadParameterName}>
                    <p className="param-title">{renderString(paramDetail.leadParameterName)}</p>
                    <p className="param-data">{paramDetail.leadParameterOptionName ? renderString(paramDetail.leadParameterOptionName) : renderString(paramDetail.leadParameterValue)}</p>
                  </div>
                ))
              }
            </div>
          </div>
        )) :
        'NA'
    }
  </Fragment>
)

export default InspectionDetails