import {

	Dialog,
	DialogContent,
	DialogTitle,

} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import 'react-picky/dist/picky.css'
import { useDispatch } from "react-redux";
import { getDatePayload } from "../../../../core/utility";
import { CalenderIcon } from "../../../../core/utility/iconHelper";
import './editCredit.scss'
import DatePickerField from "./DatePicker2";
// import { generateWalletOTP } from "../../../../core/services/shdPaymentServices";
// import { getUserID } from "../../../../core/services/authenticationServices";
import { setNotification } from "../../../../redux/actions/notificationAction";
// import { getComaSeparated, getTitleCase } from "../../../../core/utility/stringUtility";
import { hideLoader, showLoader } from "../../../../redux/actions/loaderAction";
import { getUserID } from "../../../../core/services/rbacServices";
import { getComaSeparated, getTitleCase } from "../../../../core/utility/stringUtility";
import { generateWalletOTP } from "../../../../core/services/shdServices";
// import { getComaSeparated, getTitleCase } from "../../../../core/utility/stringUtility";

const useStyles = makeStyles((theme) => ({

}));

export default function ModelComponent({
	open,
	onClose,
	userCredit,
	openOTPPopPup
}) {

	const dispatch = useDispatch();

	const [updatedLimit, setUpdatedLimit] = useState("")
	const [isLimitError, setIsLimitError] = useState(false)
	const [selectedDate, setSelectedDate] = useState(null)
	const [limitErrorMessage, setLimitErrorMessage] = useState('')



	const todaysDate = new Date()
	const expiryDate = new Date(userCredit.expiryDate)
	const userID = getUserID()


	const payload = {
		status: "ENABLED",
		walletId: userCredit.walletId,
		creditLimit: (userCredit.status === "DISABLED" || userCredit.status === "EXPIRED") ? Boolean(updatedLimit) ? updatedLimit : null : updatedLimit,
		cityId: userCredit.cityId,
		expiryDate: getDatePayload(selectedDate),
		loginUserId: userID,
		otp: "",
		otpPrimaryKey: ""
	}


	const handleLimit = (e) => {
		setIsLimitError(false)
		setUpdatedLimit((e.target.value))
		if (e.target.value > userCredit.availableCityLimit + userCredit.currentWalletCreditLimit) {
			setIsLimitError(true)
			setLimitErrorMessage("Credit amount exceeds than the available city limit balance")
		}
		if (e.target.value < 0) {
			setIsLimitError(true)
			setLimitErrorMessage("Credit limit cannot be less than zero")
		}

	}


	const selectedDateChange = (selectedDate) => {
		setSelectedDate(selectedDate)
	}

	const handleGenerateOTP = () => {
		dispatch(showLoader())
		generateWalletOTP(userID).
			then(apiResponse => {
				if (apiResponse.isValid) {
					dispatch(hideLoader())
					dispatch(setNotification("success", "Success", `OTP sent to ${apiResponse.otpSentTo}`));
					payload.otpPrimaryKey = apiResponse.otpPrimaryKey
					openOTPPopPup(apiResponse, payload, "updateCreditLimit")
				}
			})
	}

	const getClassNameStatus = (value) => {
		if (value === 'ENABLED') {
			return 'statusBox enabled'
		} else if (value === 'DISABLED') {
			return 'statusBox disabled'
		} else if (value === 'PENDING') {
			return 'statusBox pendingT'
		} else if (value === 'EXPIRED') {
			return 'statusBox disabled'
		}
		else return ``
	}


	useEffect(() => {
		if (expiryDate.getTime() > todaysDate.getTime()) {
			selectedDateChange(expiryDate)
		}
	}, []);


	return (
		<div>
			<Dialog open={open} onClose={onClose} className="dialogMainCreditLimit">
				<DialogTitle>
					{"Business Credit Limit"}{' '}
					{
						userCredit.currentWalletCreditLimit > 0 && <span
							className={getClassNameStatus(userCredit.status)}
						>
							{getTitleCase(userCredit.status)}

						</span>
					}
					<span
						className="float-right"
						onClick={onClose}
						style={{ cursor: 'pointer' }}
					>
						&#10005;
					</span>
				</DialogTitle>
				<DialogContent className="dialogContent">
					<div className="editCardMain">
						<div className="inputRow">
							<label>Available City Balance</label>
							<span>₹
								<input
									type="text"
									disabled
									className="inputBalance availableBalance"
									value={getComaSeparated(userCredit.availableCityLimit)}

								/>
							</span>

						</div>

						<div className="inputRow">
							<label>Working Capital</label>
							<span>₹
								<input
									type="text"
									disabled
									className="inputBalance availableBalance"
									value={getComaSeparated(userCredit.currentWorkingCapital)}

								/>
							</span>

						</div>
						
						{userCredit.currentWalletCreditLimit > 0 &&
							<div className="inputRow">
								<label>Current Credit Limit</label>
								<span>₹
									<input
										type="text"
										disabled
										className="inputBalance availableBalance"
										value={getComaSeparated(userCredit.currentWalletCreditLimit)}

									/>
								</span>

							</div>
						}


						<div className="inputRow">
							<label>Set Credit Limit</label>
							<span>₹
								<input
									type="number"
									className="inputBalance"
									placeholder="Enter Amount"
									value={updatedLimit}
									onChange={handleLimit}
								/>
							</span>
						</div>
						{isLimitError && (
							<div className="inputRow">
								<span></span>
								<div className="limiterrorDiv">
									<p>
										{limitErrorMessage}
									</p>
								</div>
							</div>
						)}
						<div className="inputRow">
							<label>Set Expiry On</label>
							<img
								src={CalenderIcon}
								style={{ pointerEvents: 'none' }}
								className="calender-icon-credit"
								alt="calender-icon"
							/>
							<div className="from-date">
								<DatePickerField
									onDateChange={selectedDateChange}
									dateFormat='dd-MMM-yyyy'
									startDate={selectedDate}
									placeholder={"dd-mmm-yyyy"}
									min={todaysDate}
								/>
							</div>
						</div>
						<div style={{ textAlign: "center" }}>

							<button
								disabled={selectedDate && (updatedLimit && !isLimitError
								) ? false : true}
								className="enableButtonCredit"
								onClick={() => handleGenerateOTP()}

							>
								{userCredit.currentWalletCreditLimit
									? "Set New Credit Limit" : "Enable Credit"}
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

		</div >
	);
}
