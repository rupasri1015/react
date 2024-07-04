import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Divider,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup

} from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import 'react-picky/dist/picky.css'
import { useDispatch } from "react-redux";
import './editCityCredit.scss'
import { generateWalletOTP } from "../../../../core/services/shdPaymentServices";
import { getUserID } from "../../../../core/services/authenticationServices";
import { setNotification } from "../../../../redux/actions/notificationAction";
import { getAmount, getComaSeparated } from "../../../../core/utility/stringUtility";
import { hideLoader, showLoader } from "../../../../redux/actions/loaderAction";

const useStyles = makeStyles((theme) => ({

}));

export default function ModelComponent({
	open,
	onClose,
	cityData,
	openOTPPopPup
}) {

	const dispatch = useDispatch();

	const [updatedLimit, setUpdatedLimit] = useState("")
	const [updatedCityLimit, setUpdatedCityLimit] = useState(cityData.cityLimit)
	const [updatedAvailableBalance, setUpdatedAvailableBalance] = useState(cityData.availableBalance)
	const [isLimitError, setIsLimitError] = useState(false)
	const [changeState, setChangeState] = useState(null)
	const [radioButton, setRadioButton] = useState('increase')
	const [limitErrorMessage, setLimitErrorMessage] = useState('')


	const userID = getUserID()


	const payload = {
		cityId: cityData.cityId,
		requestedCityCreditLimit: updatedCityLimit,
		loginUserId: userID,
		otp: "",
		otpPrimaryKey: ""
	}


	const handleLimit = (e) => {
		setIsLimitError(false)
		setUpdatedLimit((e.target.value))

		if (e.target.value && e.target.value < 1) {
			setIsLimitError(true)
			setLimitErrorMessage("Limit Change can not be less than One")
		} else {
			if (radioButton === "increase") {
				setUpdatedCityLimit(Number(e.target.value) + cityData.cityLimit)
				setUpdatedAvailableBalance(Number(e.target.value) + cityData.availableBalance)

				if (Number(e.target.value) + cityData.cityLimit <= 0) {
					setIsLimitError(true)
					setLimitErrorMessage("City credit limit can not be equalt to or less than Zero")
				}

			}
			if (radioButton === "decrease") {
				setUpdatedCityLimit(-Number(e.target.value) + cityData.cityLimit)
				setUpdatedAvailableBalance(-Number(e.target.value) + cityData.availableBalance)

				if ((-Number(e.target.value) + cityData.cityLimit) < (cityData.cityLimit - cityData.availableBalance)) {
					setIsLimitError(true)
					setLimitErrorMessage("City credit limit can not be less than used Credit limit")
				}
				else if (-Number(e.target.value) + cityData.cityLimit <= 0) {
					setIsLimitError(true)
					setLimitErrorMessage("City credit limit can not be equalt to or less than Zero")
				}

			}
		}

	}

	const handleChange = (e) => {
		setIsLimitError(false)
		setRadioButton((e.target.value))

		setChangeState(e.target.value)

		if (updatedLimit && updatedLimit < 1) {
			setIsLimitError(true)
			setLimitErrorMessage("Limit Change can not be less than One")
		} else {
			if (e.target.value === "increase") {
				setUpdatedCityLimit(Number(updatedLimit) + cityData.cityLimit)
				setUpdatedAvailableBalance(Number(updatedLimit) + cityData.availableBalance)

			}
			if (e.target.value === "decrease") {
				setUpdatedCityLimit(-Number(updatedLimit) + cityData.cityLimit)
				setUpdatedAvailableBalance(-Number(updatedLimit) + cityData.availableBalance)

				if ((-Number(updatedLimit) + cityData.cityLimit) < (cityData.cityLimit - cityData.availableBalance)) {
					setIsLimitError(true)
					setLimitErrorMessage("City credit limit can not be less than used Credit limit")
				}
				else if (-Number(updatedLimit) + cityData.cityLimit <= 0) {
					setIsLimitError(true)
					setLimitErrorMessage("City credit limit can not be equalt to or less than Zero")
				}

			}
		}

	}


	const handleGenerateOTP = () => {
		dispatch(showLoader())
		generateWalletOTP(userID).
			then(apiResponse => {
				if (apiResponse.isValid) {
					dispatch(hideLoader())
					dispatch(setNotification("success", "Success", `OTP sent to ${apiResponse.otpSentTo}`));
					payload.otpPrimaryKey = apiResponse.otpPrimaryKey
					openOTPPopPup(apiResponse, payload, "updateCityLimit")
				}
			})
	}


	return (
		<div>
			<Dialog open={open} onClose={onClose} className="dialogMainCreditLimit">
				<DialogTitle>
					{cityData.cityName}{" Credit Limit"}
					<span
						className="float-right"
						onClick={onClose}
						style={{ cursor: 'pointer' }}
					>
						&#10005;
					</span>
				</DialogTitle>
				<Divider />
				<DialogContent className="dialogContent">
					<div className="editCardMain">
						<div className="inputRow">
							<label>Current City Limit</label>
							<span>₹
								<input
									type="text"
									disabled
									className="inputBalance availableBalance"
									value={getComaSeparated(cityData.cityLimit)}

								/>
							</span>

						</div>
						<div className="inputRow">
							<label>Change Limit By</label>
							<span style={{ width: '280px' }}>
								<FormControl>
									<RadioGroup
										row
										aria-labelledby="demo-form-control-label-placement"
										name="position"
										onChange={handleChange}
									>
										<FormControlLabel
											value="increase"
											control={<Radio />}
											label="Increase"
											color="primary"
											labelPlacement="end"
										/>
										<FormControlLabel
											value="decrease"
											control={<Radio />}
											label="Decrease"
											labelPlacement="end"
										/>
									</RadioGroup>
								</FormControl>
							</span>

						</div>


						{changeState && <div>


							<div className="inputRow">
								<label> </label>
								<span>₹
									<input
										type="number"
										className="inputBalance"
										placeholder="Enter Amount"
										value={updatedLimit}
										onChange={handleLimit}
										min="0"
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


							<div className="balanceCalculationContainer">

								<div className="calculatedLimitContainer">
									<div className="lableBoxCredit">New City Limit</div>
									<div style={{ textAlign: "right" }}>{getAmount(updatedCityLimit)}</div>
								</div>
								<Divider />
								<div className="calculatedLimitContainer">
									<div className="lableBoxCredit">Available Balance</div>
									<div style={{ textAlign: "right" }}>{getAmount(updatedAvailableBalance)}</div>
								</div>

							</div>
						</div>
						}
					</div>
				</DialogContent>
				<Divider />
				{
					changeState &&
					<DialogActions>
						<div style={{ margin: ' 10px auto' }}>

							<button
								disabled={(!isLimitError && updatedLimit && (updatedLimit !== '0') && updatedCityLimit > 0) ? false : true}
								className="enableButtonCredit"
								onClick={() => handleGenerateOTP()}

							>
								Set New City Limit
							</button>
						</div>
					</DialogActions>
				}
			</Dialog>

		</div >
	);
}
