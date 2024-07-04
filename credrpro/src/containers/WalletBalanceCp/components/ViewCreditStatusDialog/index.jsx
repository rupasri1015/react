import {

	Dialog,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,

} from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from "react-redux";
import { CurrentCreditIcon, AvailableCreditIcon } from "../../../../core/utility/iconHelper";
import './creditStatus.scss'
// import { getUserID } from "../../../../core/services/authenticationServices";
import { setNotification } from "../../../../redux/actions/notificationAction";
import { generateWalletOTP } from "../../../../core/services/shdServices";
import { getAmount, getComaSeparated, getDate, getTitleCase } from "../../../../core/utility/stringUtility";
import { hideLoader, showLoader } from "../../../../redux/actions/loaderAction";
import { getUserID } from "../../../../core/services/rbacServices";

const useStyles = makeStyles((theme) => ({
	tableContainer: {
		borderRadius: 15,
		boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 5px;",
		height: 250,
	},
	tableHeaderCell: {
		fontWeight: 'bold',
		backgroundColor: "#CEE1F2",
		color: '#333333',

	},

	cellPaddingLight: {
		width: '5% !important',
	}

}));

export default function ModelComponent({
	open,
	onClose,
	userCredit,
	editLimit,
	openOTPPopPup
}) {

	const userId = getUserID()
	const dispatch = useDispatch();
	const classes = useStyles()

	const payload = {
		status: "DISABLED",
		walletId: userCredit.walletId,
		cityId: userCredit.cityId,
		"loginUserId": userId,
		"otp": "",
		"otpPrimaryKey": ""
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


	const handleGenerateOTP = () => {
		dispatch(showLoader())
		generateWalletOTP(userId).
			then(apiResponse => {
				if (apiResponse.isValid) {
					dispatch(hideLoader())
					dispatch(setNotification("success", "Success", `OTP sent to ${apiResponse.otpSentTo}`));
					payload.otpPrimaryKey = apiResponse.otpPrimaryKey
					openOTPPopPup(apiResponse, payload, "updateCreditLimit")
				}
			})
	}

	return (
		<div>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle sx={{ mt: 2 }}>
					{"Business Credit Limit"}{' '}
					<span
						className={getClassNameStatus(userCredit.status)}
					>
						{userCredit.status && getTitleCase(userCredit.status)}

					</span>
					<span
						className="float-right"
						onClick={onClose}
						style={{ cursor: 'pointer' }}
					>
						&#10005;
					</span>
				</DialogTitle>
				<DialogContent className="dialog">
					<p style={{ fontSize: '18px' }}>Balance Details</p>
					<div className="balanceContainerMain">
						<div className="balanceContainer">
							<div className="paperContainer">
								<div className="limitContainer">
									<div className="limitContainerLable">
										Current Credit Limit
									</div>
									<div className="limitContainerValue">
										₹ {getComaSeparated(userCredit.currentWalletCreditLimit)}
									</div>
								</div>
								<div className="limitIconContainer">
									<img
										src={CurrentCreditIcon}
										style={{ pointerEvents: 'none' }}
										alt="calender-icon"
									/>
								</div>
							</div>
							<div className="paperContainer">
								<div className="limitContainer">
									<div className="limitContainerLable">
										Available Credit Limit
									</div>
									<div className="limitContainerValue">
										₹ {getComaSeparated(userCredit.availableWalletCreditLimit)}
									</div>
								</div>
								<div className="limitIconContainer">
									<img
										src={AvailableCreditIcon}
										style={{ pointerEvents: 'none' }}
										alt="calender-icon"
									/>
								</div>
							</div>
						</div>

						{
							(userCredit.status === 'PENDING' || userCredit.status === 'ENABLED') &&
							<div className="expiryDateContainer">
								<p>This credit limit will expire on {(getDate(userCredit.expiryDate)).slice(0, 11)}</p>
							</div>

						}

						{
							(userCredit.status === 'EXPIRED') &&
							<div className="expiredDateContainer">
								<p>This credit limit expired on {(getDate(userCredit.expiryDate)).slice(0, 11)}</p>
							</div>

						}


						<div className="buttonContianer">
							{userCredit.status !== "DISABLED" && <button className="editButtonCredit" onClick={() => editLimit(userCredit)}>
								Edit Limit
							</button>}
							<button className={userCredit.status === "DISABLED" ? "enableButtonCredit" : "disableButtonCredit"}
								onClick={() => { userCredit.status === "DISABLED" ? editLimit(userCredit) : handleGenerateOTP() }}
							>
								{
									userCredit.status === "DISABLED" ? "Enable Credit" : "Disable Credit"
								}

							</button>

						</div>

					</div>

					<div>
						<TableContainer className={classes.tableContainer} component={Paper}>
							<Table className={classes.table} stickyHeader aria-label="sticky table">

								<TableHead>
									<TableRow>
										<TableCell className={`${classes.tableHeaderCell} ${classes.cellPaddingLight}`} >Approver</TableCell>
										<TableCell className={`${classes.tableHeaderCell}`} align="left">Date and time</TableCell>
										<TableCell className={`${classes.tableHeaderCell}`} align="left">Limit Changes</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{userCredit.creditLimitHistory && (userCredit.creditLimitHistory).map((row, i) => {
										return (
											<TableRow key={i}>
												<TableCell component="td" scope="row" className={`${classes.cellPaddingLight}`}> {row.approverName}</TableCell>
												<TableCell sx={{}} align="left">{getDate(row.givenDate)}</TableCell>
												<TableCell align="left">{row.creditMessage}</TableCell>
											</TableRow>
										)
									}
									)}
								</TableBody>
							</Table>
						</TableContainer>

					</div>
				</DialogContent>
			</Dialog>

		</div >
	);
}
