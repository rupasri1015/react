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
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { getAmount } from "../../../../core/utility";
import { EditIcon } from "../../../../core/utility/iconHelper";




const useStyles = makeStyles((theme) => ({
	table: {
		Width: 600,
	},
	tableContainer: {
		borderRadius: 15,

	},
	tableHeaderCell: {
		fontWeight: 'bold',
		backgroundColor: "#CEE1F2",
		color: '#333333',

	},
	tableBodyCellDark: {
		backgroundColor: "#E7E7E7",
		color: '#757575',
		marginRight: '100px'
	},
	tableBodyCellLight: {
		backgroundColor: "#FDFDFD",
		color: '#757575',
		fontWeight: 'light',
	},
	cellPaddingLight: {
		paddingRight: '100px'
	}

}));


function generateFingerprint() {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const txt = 'abcdefghijklmnopqrstuvwxyz0123456789';
	ctx.textBaseline = "top";
	ctx.font = "14px 'Arial'";
	ctx.textBaseline = "alphabetic";
	ctx.fillStyle = "#f60";
	ctx.fillRect(125, 1, 62, 20);
	ctx.fillStyle = "#069";
	ctx.fillText(txt, 2, 15);
	ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
	ctx.fillText(txt, 4, 17);
	const dataURI = canvas.toDataURL('image/jpeg');
	const b64 = dataURI.replace(/^data:image\/(png|jpg);base64,/, "");
	let hash = 0;
	for (let i = 0; i < b64.length; i++) {
		const char = b64.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash;
}

export default function ModelComponent({
	open,
	onClose,
	cityLimits,
	onEdit,
}) {

	const classes = useStyles()


	console.log("generateFingerprint view Credit", generateFingerprint())

	return (
		<div>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>
					{"City Level Business Credit Limit"}{' '}
					<span
						className="float-right"
						onClick={onClose}
						style={{ cursor: 'pointer' }}
					>
						&#10005;
					</span>
				</DialogTitle>
				<DialogContent className="dialog">
					<TableContainer className={classes.tableContainer} component={Paper}>
						<Table className={classes.table} aria-label="simple table">

							<TableHead sx={{ bgColor: "green" }}>
								<TableRow								>
									<TableCell className={`${classes.tableHeaderCell} ${classes.cellPaddingLight}`} >City</TableCell>
									<TableCell className={`${classes.tableHeaderCell} ${classes.cellPaddingLight}`} align="left">{`City\u00a0Limit`}</TableCell>
									<TableCell className={`${classes.tableHeaderCell}`} align="left">{`Available\u00a0Balance`}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{cityLimits.map((row, i) => (
									<TableRow
										key={row.cityId}
									>
										<TableCell className={i % 2 === 0 ? classes.tableBodyCellDark : classes.tableBodyCellLight} component="th" scope="row">
											{row.cityName}
										</TableCell>
										<TableCell className={i % 2 === 0 ? classes.tableBodyCellDark : classes.tableBodyCellLight} sx={{}} align="left">
											<a className="icon_edit" style={{ marginRight: '25px', cursor: 'pointer' }}
												onClick={() => onEdit(row)}

											>
												<img src={EditIcon} alt="Edit City Limit" />
											</a>
											{getAmount(row.cityLimit)}
										</TableCell>
										<TableCell className={i % 2 === 0 ? classes.tableBodyCellDark : classes.tableBodyCellLight} align="left">{getAmount(row.availableBalance)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

				</DialogContent>
			</Dialog>
		</div >
	);
}
