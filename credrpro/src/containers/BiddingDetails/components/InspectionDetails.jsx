import React, { Fragment } from 'react'
import { renderString } from '../../../core/utility'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
const getParams = params => {
  if (params) return params.filter(param => (param.title !== 'ADD PHOTOS' && param.title !== 'ADD VIDEO'))
  return []
}

const InspectionDetails = ({ inspectionParameters }) => {
  const [value, setValue] = React.useState('issues');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (

    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab value="issues" label="Issues in the Vehicle" />
            <Tab value="noIssues" label="All Okay" />
          </TabList>
        </Box>
        <TabPanel value="issues">
          {
            inspectionParameters ?
            <>
              <table className='table table-bordered' style={{ width: "50%", backgroundColor: "white", marginBottom: "0px", textAlign: "center" }}>
                <thead className='table-dark' >
                  <tr>
                    <th style={{ width: "30%", borderRightColor: "white" }}>Parameters</th>
                    <th style={{minWidth: "70%"}}>Symptoms</th>
                  </tr>
                </thead>
              </table>
              <table className='table' style={{ width: "50%", backgroundColor: "white", display: "block", overflow: "scroll", padding: "20px", maxHeight: "600px",height:"auto"}}>
                <tbody >
                  {
                    inspectionParameters.length &&
                    inspectionParameters.map((item) => {
                      if (item.leadParameterType === 'SINGLE' && item.leadParameterValue !== "No issues") {
                        let syms = item.leadParameterValue.split('\n')
                        return (<tr>
                          <td style={{ width: "30%" }}><b>{item.leadParameterName}</b></td>
                          <td style={{ width: "70%" }}>
                            <ul style={{paddingLeft:"35px"}} >
                              {
                                syms && syms.map((syn) => {
                                  return <li >{syn}</li>
                                })
                              }
                            </ul>
                          </td>
                        </tr>)
                      }

                    })
                  }
                </tbody>
              </table>
            </>
            :
            <span style={{color:"red"}}>No Data</span>
          }
        </TabPanel>
        <TabPanel value="noIssues">
        {
          inspectionParameters ?
        <>
          <table className='table table-bordered' style={{ width: "30%", backgroundColor: "white", marginBottom: "0px", textAlign: "center" }}>
            <thead className='table-dark' >
              <tr>
                <th style={{ width: "35%", borderRightColor: "white" }}>Parameters</th>
              </tr>
            </thead>
          </table>
          <table className='table' style={{ width: "30%", backgroundColor: "white", display: "block", overflow: "scroll", maxHeight: "600px",height:"auto", padding: "20px" }}>
            <tbody >
              {
                 inspectionParameters.length &&
                inspectionParameters.map((item) => {

                  if (item.leadParameterType === 'SINGLE' && item.leadParameterValue === "No issues") {
                    return (<tr>
                      <td style={{ width: "30%" }}><b>{item.leadParameterName}</b></td>

                    </tr>)
                  }

                })
              }
            </tbody>
          </table>
          </>
          :
          <span style={{color:"red"}}>No Data</span>
        }
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default InspectionDetails