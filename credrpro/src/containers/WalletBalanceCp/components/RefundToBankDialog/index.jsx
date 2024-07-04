import {
	Dialog,
	DialogContent,
	DialogTitle,

} from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import 'react-picky/dist/picky.css'
import { useDispatch } from "react-redux";
import { InfoOutlinedIconBank } from "../../../../core/utility/iconHelper";
import './refundTobank.scss'
import { generateWalletOTP } from "../../../../core/services/shdPaymentServices";
import { getUserID } from "../../../../core/services/authenticationServices";
import { setNotification } from "../../../../redux/actions/notificationAction";
import { CommentOutlined } from "@material-ui/icons";
import { getComaSeparated } from "../../../../core/utility/stringUtility";
import { hideLoader, showLoader } from "../../../../redux/actions/loaderAction";

const useStyles = makeStyles((theme) => ({

}));

export default function ModelComponent({
	open,
	onClose,
	userData,
	walletBalance,
	openOTPPopPup
}) {

	const dispatch = useDispatch();

	const [refundAmount, setRefundAmount] = useState("")
	const [comments, setComments] = useState("")
	const [isAmountError, setIsAmountError] = useState(false)
	const [limitErrorMessage, setLimitErrorMessage] = useState('')

	const userID = getUserID()


	const payload = {
		walletId: userData.walletId,
		storeId: userData.storeId,
		refundAmount: refundAmount,
		loginUserId: userID,
		comments: comments,
		otp: '',
		otpPrimaryKey: '',
	}


	const handleLimit = (e) => {
		setIsAmountError(false)
		setRefundAmount(e.target.value)
		if (e.target.value > walletBalance) {
			setIsAmountError(true)
			setLimitErrorMessage(`Refund amount cannot be more than ₹${getComaSeparated(walletBalance)}`)
		}
		if (e.target.value && e.target.value < 1) {
			setIsAmountError(true)
			setLimitErrorMessage("Refund amount cannot be less than one")
		}
	}

	const handleComments = (e) => {
		setComments(e.target.value)
	}

	const handleGenerateOTP = () => {
		dispatch(showLoader())
		generateWalletOTP(userID).
			then(apiResponse => {
				if (apiResponse.isValid) {
					dispatch(hideLoader())
					dispatch(setNotification("success", "Success", `OTP sent to ${apiResponse.otpSentTo}`))
					payload.otpPrimaryKey = apiResponse.otpPrimaryKey
					openOTPPopPup(apiResponse, payload, 'refundToBank')
				}
			})
	}


	return (
		<div>
			<Dialog open={open} onClose={onClose} className="dialogMain">
				<DialogTitle>
					{"Issue Refund In Bank"}{' '}
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
							<label>Current Wallet balance</label>
							<span>₹
								<input
									type="text"
									disabled
									className="inputBalance availableBalance"
									value={getComaSeparated(walletBalance)}

								/>
							</span>

						</div>
						<div className="inputRow">
							<label>Refund Amount</label>
							<span>₹
								<input
									type="number"
									className="inputBalance"
									placeholder="Enter Amount"
									value={refundAmount}
									onChange={handleLimit}
									disabled={walletBalance <= 0 ? true : false}
								/>
							</span>
						</div>



						{isAmountError && (
							<div className="inputRow">
								<span></span>
								<div className="limiterrorDiv">
									<p>
										{limitErrorMessage}
									</p>
								</div>
							</div>
						)}

						{walletBalance <= 0 && (
							<div className="inputRow">
								<span></span>
								<div className="limiterrorDiv">
									<p>
										Outstanding Balance exists. Refund cannot be made
									</p>
								</div>
							</div>
						)}
						<CommentOutlined /> <label>Comments</label>
						<textarea className="textarea" placeholder="Enter comments here"
							value={comments}
							onChange={handleComments}
							required
						></textarea>

						<p style={{ fontSize: '18px' }}>Bank Details</p>
						<div className="walletDetailsContainer">
							<div>
								<span> Account Number</span> <span>{userData.personalAccountNumber ? userData.personalAccountNumber : 'NOT AVAIALABLE'}</span>
							</div>
							<div>
								<span> IFSC Code</span> <span>{userData.personalIfscCode ? userData.personalIfscCode : 'NOT AVAIALABLE'}</span>
							</div>

						</div>
						<div style={{ textAlign: "center", padding: '10px' }}>

							<div className="infoBox">
								<img className="btn-icon-square" src={InfoOutlinedIconBank} alt="Info" /> <span> {userData.personalAccountNumber ? "Amount Will Be Refunded To Bank" : "Bank Info Not Available For Processing Refund"}</span>
							</div>
							<button
								disabled={comments && refundAmount && userData.personalAccountNumber && userData.personalIfscCode && !isAmountError ? false : true}
								className="refundButton"
								onClick={() => handleGenerateOTP()}
							>
								Refund In Bank
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

		</div >
	);
}
