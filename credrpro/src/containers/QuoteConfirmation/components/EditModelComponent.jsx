import { Card, CardActions, CardContent, CardHeader, Dialog, DialogContent } from '@material-ui/core'
import React, { useState } from 'react'
import { Button } from 'reactstrap'
import './style.scss'
import { getAmount } from '../../../core/utility'
import { useDispatch } from "react-redux";
import { setNotification } from '../../../redux/actions/notificationAction'
import { onlyNumber } from '../../../core/utility/inputNormalizers'
import { updateCustomerDetails } from '../../../core/services/miscServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { Error } from '@material-ui/icons'
export default function index({ open, onClose, leadId, name, email,refreshPage }) {
    
    const [updatedName, setUpdatedName] = useState(name);
    const [updatedEmail, setUpdatedEmail] = useState(email);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState(false);
    const dispatch = useDispatch();
    const handleAdd = () => {
        let payload={}
        payload.leadId=leadId
        payload.userFirstName=updatedName
        payload.emailId=updatedEmail
        let nameReg=/^[a-zA-Z ]*$/
        let emailReg=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(!nameReg.test(updatedName))
        {
            setIsError(true);
              setErrorText("Invalid Name");
        }
        else if(!emailReg.test(updatedEmail))
        {
            setIsError(true);
              setErrorText("Invalid Email");
        }
        else{
            updateCustomerDetails(payload)
            .then((apiResponse) => {
                if (apiResponse.isValid) {
                  dispatch(setNotification("success", "Success", apiResponse.message));
                  refreshPage();
                  onClose();
                //   refreshPage();
                  setIsError(false);
                  setErrorText("");
                } else {
                  dispatch(setNotification("danger", "Error", apiResponse.message));
                }
              });
        }
       

    };
    const handleName = (e) => {
        setIsError(false)
        setUpdatedName(e.target.value)
        if((e.target.value).length<5){
            setIsError(true);
              setErrorText("Customer Name Should Be As Per ID Proof/RC Card");
        }
    }
    const handleEmail = (e) => {
        setUpdatedEmail(e.target.value)
    }
    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogContent className="dialog">
                    <Card className="innerCard">
                        <CardHeader
                            title={<p className="headerText">Edit Customer Details</p>}
                        />
                        <CardContent >
                            <div className="row">
                                <div className="col-5 text-right">Customer Name : </div>
                                <div className="col-7 ">
                                    <input
                                        type="text"
                                        className="inputField"
                                        placeholder="Enter Name"
                                        value={updatedName}
                                        onChange={handleName}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-5 text-right">Email Id : </div>
                                <div className="col-7">
                                    <input
                                        type="email"
                                        className="inputField"
                                        placeholder="Enter Email Id"
                                        value={updatedEmail}
                                        onChange={handleEmail}
                                    />
                                </div>
                            </div>
                            {isError && (
                                <div className="row" >
                                    <div className="errorDiv">
                                        <div style={{ padding: "0px 5px" }}>
                                            <Error style={{ width: "15px" }} />
                                            {errorText}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <div style={{ textAlign: "center" }}>
                            <Button
                                color="primary"
                                className="addpricebtn"
                                onClick={handleAdd}
                                disabled={isError ? true : false}
                            >
                                Update
                            </Button>
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    )
}
