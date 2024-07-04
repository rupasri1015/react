import React, { useEffect, useState, useRef } from 'react'
import { FormControl, InputBase, InputLabel, withStyles, makeStyles, NativeSelect, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Button, Chip } from '@material-ui/core'
import { getAmount } from '../../../../../core/utility/stringUtility'
import { overRideToStore } from '../../../../../core/services/quoteConfServices'
import { getUserID } from '../../../../../core/services/rbacServices'
import FormHelperText from '@material-ui/core/FormHelperText'
import { useDispatch, useSelector } from "react-redux"
import { setCommissionData } from '../../../../../redux/actions/commissionDataAction'

export default function Commission({ orderDedctions, rowInfo, leadData, status, handleUpdateComm, enable, handleEnable, enableCommissionForm, cusAmount, cpAmount, storeAmount, handleCpAmt, handleCusAmt, handleStoreAmt,
    newVal, overrideColor, handleOverrideColor, onShowResponseMessage, showCp, showStore, handleCp, handleStore, option, handleOption, refresh }) {

    const regex = new RegExp('^[0-9]*$')
    const BootstrapInput = withStyles((theme) => ({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
            },
        },
        input: {
            borderRadius: 4,
            border: 'none',
            position: 'relative',
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #ced4da',
            fontSize: 16,
            padding: '10px 0px 10px 5px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
        },
    }))(InputBase);

    const useStyles = makeStyles((theme) => ({
        table: {
            '& .MuiTableCell-root': {
                borderBottom: 'none',
                fontWeight: '500',
                height: '2rem',
                padding: '5px 0 5px 10px'
            },
            '& .MuiInputBase-root': {
                height: '2rem', width: '7rem', marginTop: '0',borderRadius:'5px'
            },
            '& .MuiButton-contained': {
                height: '2rem',
                width: '7rem',
                color: 'black',
                justifyContent: 'flex-start'
            },
            '& .MuiFilledInput-root':{
                paddingBottom:'15px',
                color:'black'
            }
        },
        commentInput: {
            '& .MuiInputBase-root': {
               width: '16.4rem',height:'auto'
            },
        },
        tableHeader: {
            height: '2rem',
            backgroundColor: '#333333',
            color: 'white',
            fontWeight: '500',
            paddingLeft: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center'
        }, margin: {
            margin: theme.spacing(1),
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '2rem'
        }
    }))

    const classes = useStyles();
    const [extraCommission, setExtraCommission] = useState(orderDedctions && orderDedctions.extraShdCommission && orderDedctions.extraShdCommission ? orderDedctions.extraShdCommission : 0)
    const [leeway, setLeeway] = useState(orderDedctions && orderDedctions.leeway && orderDedctions.leeway ? orderDedctions.leeway : 0)
    const [trafficChallan, setTrafficChallan] = useState(orderDedctions && orderDedctions.userDeductions && orderDedctions.userDeductions.userTrafficChalan && orderDedctions.userDeductions.userTrafficChalan && orderDedctions.userDeductions.userTrafficChalan ? orderDedctions.userDeductions.userTrafficChalan : 0)
    const [hpRto, setHpRto] = useState(orderDedctions && orderDedctions.userDeductions && orderDedctions.userDeductions.userHpRtoCharges && orderDedctions.userDeductions.userHpRtoCharges && orderDedctions.userDeductions.userHpRtoCharges ? orderDedctions.userDeductions.userHpRtoCharges : 0)
    const [docQc2Charges, setDocQc2Charges] = useState(orderDedctions && orderDedctions.docQc2Deductions && orderDedctions.docQc2Deductions ? orderDedctions.docQc2Deductions : 0)
    const [comments, setComments] = useState((orderDedctions && orderDedctions.comments && orderDedctions.comments) && orderDedctions.comments)
    const [newCommission, setNewCommission] = useState('')
    const [showNewCommissionError, setShowNewCommissionError] = useState(false)
   
    const dispatch = useDispatch()
    // localStorage.setItem('optionValue', orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo === 'CP' ? 'Channel Partner' : 'Store')

    const handleChange = (event) => {
        handleOption(event.target.value);
    };


    // localStorage.setItem('commissionObject', JSON.stringify(() => finalAmtCustomer()));

    const onCommissionChange = (event) => {
        if (regex.test(event.target.value) && Number(event.target.value) < 10000000) {
            setExtraCommission(event.target.value)
            const payload = {
                cityLevelCommission: orderDedctions && orderDedctions.cityLevelCommission && orderDedctions.cityLevelCommission ? orderDedctions.cityLevelCommission : 0,
                comments: comments,
                leadId: rowInfo.leadId,
                loginId: getUserID(),
                userId: getUserID(),
                rtoCharges: hpRto,
                challanCharges: trafficChallan,
                shdAdditionalCommission: event.target.value,
                newPurchaseCost: newCommission ? newCommission : ((orderDedctions && orderDedctions.newProcurementPrice) ? orderDedctions.newProcurementPrice : orderDedctions.storeProcuredPrice),
                leeway: leeway,
                finalCusAmt:finalAmtCustomer(),
                finalCpAmt: finalAmtCP(),
                finalStoreAmt: finalAmtStore(),
                purchaseFor: showStore ? 'STORE' : 'CP'
            }
            localStorage.setItem('commissionObject', JSON.stringify(payload));
        }
    }

    const onLeewayChange = (event) => {
        if (regex.test(event.target.value) && Number(event.target.value) < 10000000) {
            setLeeway(event.target.value)
            const payload = {
                cityLevelCommission: orderDedctions && orderDedctions.cityLevelCommission && orderDedctions.cityLevelCommission ? orderDedctions.cityLevelCommission : 0,
                comments: comments,
                leadId: rowInfo.leadId,
                loginId: getUserID(),
                userId: getUserID(),
                rtoCharges: hpRto,
                challanCharges: trafficChallan,
                shdAdditionalCommission: extraCommission,
                newPurchaseCost: newCommission ? newCommission : ((orderDedctions && orderDedctions.newProcurementPrice) ? orderDedctions.newProcurementPrice : orderDedctions.storeProcuredPrice),
                leeway: event.target.value,
                finalCusAmt: finalAmtCustomer(),
                finalCpAmt: finalAmtCP(),
                finalStoreAmt: finalAmtStore(),
                purchaseFor: showStore ? 'STORE' : 'CP'
            }
            localStorage.setItem('commissionObject', JSON.stringify(payload));
        }
    }

    const onTrafficChallanChange = (event) => {
        if (regex.test(event.target.value) && Number(event.target.value) < 10000000) {
            setTrafficChallan(event.target.value)
            const payload = {
                cityLevelCommission: orderDedctions && orderDedctions.cityLevelCommission && orderDedctions.cityLevelCommission ? orderDedctions.cityLevelCommission : 0,
                comments: comments,
                leadId: rowInfo.leadId,
                loginId: getUserID(),
                userId: getUserID(),
                rtoCharges: hpRto,
                challanCharges: event.target.value,
                shdAdditionalCommission: extraCommission,
                newPurchaseCost: newCommission ? newCommission : ((orderDedctions && orderDedctions.newProcurementPrice) ? orderDedctions.newProcurementPrice : orderDedctions.storeProcuredPrice),
                leeway: leeway,
                finalCusAmt: finalAmtCustomer(),
                finalCpAmt: finalAmtCP(),
                finalStoreAmt: finalAmtStore(),
                purchaseFor: showStore ? 'STORE' : 'CP'
            }
            localStorage.setItem('commissionObject', JSON.stringify(payload));
        }
    }

    const onHpRtoChange = (event) => {
        if (regex.test(event.target.value) && Number(event.target.value) < 10000000) {
            setHpRto(event.target.value)
            const payload = {
                cityLevelCommission: orderDedctions && orderDedctions.cityLevelCommission && orderDedctions.cityLevelCommission ? orderDedctions.cityLevelCommission : 0,
                comments: comments,
                leadId: rowInfo.leadId,
                loginId: getUserID(),
                userId: getUserID(),
                rtoCharges: event.target.value,
                challanCharges: trafficChallan,
                shdAdditionalCommission: extraCommission,
                newPurchaseCost: newCommission ? newCommission : ((orderDedctions && orderDedctions.newProcurementPrice) ? orderDedctions.newProcurementPrice : orderDedctions.storeProcuredPrice),
                leeway: leeway,
                finalCusAmt: finalAmtCustomer(),
                finalCpAmt: finalAmtCP(),
                finalStoreAmt: finalAmtStore(),
                purchaseFor: showStore ? 'STORE' : 'CP'
            }
            localStorage.setItem('commissionObject', JSON.stringify(payload));
        }
    }

    const oDocQc2ChargesChange = (event) => {
        if (regex.test(event.target.value)) {
            setDocQc2Charges(event.target.value)
            const payload = {
                cityLevelCommission: orderDedctions && orderDedctions.cityLevelCommission && orderDedctions.cityLevelCommission ? orderDedctions.cityLevelCommission : 0,
                comments: comments,
                leadId: rowInfo.leadId,
                loginId: getUserID(),
                userId: getUserID(),
                rtoCharges: hpRto,
                challanCharges: trafficChallan,
                shdAdditionalCommission: extraCommission,
                newPurchaseCost: newCommission ? newCommission : ((orderDedctions && orderDedctions.newProcurementPrice) ? orderDedctions.newProcurementPrice : orderDedctions.storeProcuredPrice),
                leeway: leeway,
                finalCusAmt: finalAmtCustomer(),
                finalCpAmt: finalAmtCP(),
                finalStoreAmt: finalAmtStore(),
                purchaseFor: showStore ? 'STORE' : 'CP'
            }
            localStorage.setItem('commissionObject', JSON.stringify(payload));
        }
    }

    const onCommentsChange = (event) => {
        if(event.target.value.length < 300){
            setComments(event.target.value)
        }
        const payload = {
            cityLevelCommission: orderDedctions && orderDedctions.cityLevelCommission && orderDedctions.cityLevelCommission ? orderDedctions.cityLevelCommission : 0,
            comments: event.target.value,
            leadId: rowInfo.leadId,
            loginId: getUserID(),
            userId: getUserID(),
            rtoCharges: hpRto,
            challanCharges: trafficChallan,
            shdAdditionalCommission: extraCommission,
            newPurchaseCost: newCommission ? newCommission : ((orderDedctions && orderDedctions.newProcurementPrice) ? orderDedctions.newProcurementPrice : orderDedctions.storeProcuredPrice),
            leeway: leeway,
            finalCusAmt: finalAmtCustomer(),
            finalCpAmt: finalAmtCP(),
            finalStoreAmt: finalAmtStore(),
            purchaseFor: showStore ? 'STORE' : 'CP'
        }
        localStorage.setItem('commissionObject', JSON.stringify(payload));
    }

    const overrideTheOriginal = () => {
        localStorage.setItem('optionValue', option);
        handleOverrideColor(false)
        enableCommissionForm(true)
        if (option === 'Channel Partner') {
            handleCp(true)
            handleStore(false)
        }
        if (option === 'Store') {
            handleCp(false)
            handleStore(true)
        }
        if (showStore) {
            // if (newCommission) {
                const payload = {
                    leadId: rowInfo.leadId,
                    loginId: getUserID(),
                    userId: getUserID(),
                    purchaseFor: 'CP'
                }
                setShowNewCommissionError(false)
                overRideToStore(payload).
                    then(apiResponse => {
                        if (apiResponse.isValid) {
                            refresh()
                            onShowResponseMessage(apiResponse.message)
                        }
                    })
            // }
            // else setShowNewCommissionError(true)
        } else {
            const payload = {
                leadId: rowInfo.leadId,
                loginId: getUserID(),
                userId: getUserID(),
                purchaseFor: 'STORE'
            }
            overRideToStore(payload).
                then(apiResponse => {
                    if (apiResponse.isValid) {
                        refresh()
                        onShowResponseMessage(apiResponse.message)
                    }
                })
        }
        localStorage.removeItem("commissionObject")
    }
    const onNewCommissionChange = (event) => {
        if (regex.test(event.target.value) && Number(event.target.value) < 10000000) {
            setNewCommission(event.target.value)
            setShowNewCommissionError(false)
            const payload = {
                cityLevelCommission: orderDedctions && orderDedctions.cityLevelCommission && orderDedctions.cityLevelCommission ? orderDedctions.cityLevelCommission : 0,
                comments: comments,
                leadId: rowInfo.leadId,
                loginId: getUserID(),
                userId: getUserID(),
                rtoCharges: hpRto,
                challanCharges: trafficChallan,
                shdAdditionalCommission: extraCommission,
                newPurchaseCost: newCommission ? event.target.value : ((orderDedctions && orderDedctions.newProcurementPrice) ? orderDedctions.newProcurementPrice : orderDedctions.storeProcuredPrice),
                leeway: leeway,
                finalCusAmt: finalAmtCustomer(),
                finalCpAmt: finalAmtCP(),
                finalStoreAmt: finalAmtStore(),
                purchaseFor: showStore ? 'STORE' : 'CP'
            }
            localStorage.setItem('commissionObject', JSON.stringify(payload));
        }
    }

    const totalDeductionCustomer = () => {
        const { cityLevelCommission } = orderDedctions
        let totalDeductionCustomer = 0
        if (extraCommission) totalDeductionCustomer += Number(extraCommission);
        if (cityLevelCommission) totalDeductionCustomer += Number(cityLevelCommission);
        if (leeway) totalDeductionCustomer += Number(leeway);
        if (trafficChallan) totalDeductionCustomer += Number(trafficChallan);
        if (hpRto) totalDeductionCustomer += Number(hpRto);
        if (docQc2Charges) totalDeductionCustomer += Number(docQc2Charges);
        return totalDeductionCustomer;
    }
    const totalDeductionCP = () => {
        let totalDeductionCP = 0
        // if (leeway) totalDeductionCP += Number(leeway);
        if (trafficChallan) totalDeductionCP += Number(trafficChallan);
        if (hpRto) totalDeductionCP += Number(hpRto);
        if (docQc2Charges) totalDeductionCP += Number(docQc2Charges);
        return totalDeductionCP;
    }
    const totalDeductionCus = () => {
        let totalDeductionCP = 0
        if (leeway) totalDeductionCP += Number(leeway);
        if (trafficChallan) totalDeductionCP += Number(trafficChallan);
        if (hpRto) totalDeductionCP += Number(hpRto);
        if (docQc2Charges) totalDeductionCP += Number(docQc2Charges);
        return totalDeductionCP;
    }
    const finalAmtCustomer = () => {
        if (orderDedctions) {
            return (Number(orderDedctions.highestBid) - totalDeductionCustomer())
        }

    }
    const finalAmtCP = () => {
        if (orderDedctions) {
            return (Number(orderDedctions.highestBid) - totalDeductionCP())
        }
    }
    const finalAmtStore = () => {
        if (orderDedctions && orderDedctions.storeProcuredPrice && !newCommission && !(orderDedctions && orderDedctions.newProcurementPrice)) {
            return (Number(orderDedctions.storeProcuredPrice) - totalDeductionCus())

        }
        else if(orderDedctions && orderDedctions.newProcurementPrice && !newCommission){
            return (Number(orderDedctions.newProcurementPrice) - totalDeductionCus())
        } else {
            return (Number(newCommission) - totalDeductionCus())
        }
    }

    const getProcurementPrice = () => {
        if (orderDedctions && orderDedctions.storeProcuredPrice && !newCommission && !(orderDedctions && orderDedctions.newProcurementPrice)) {
            return orderDedctions.storeProcuredPrice
        }
        else if(orderDedctions && orderDedctions.newProcurementPrice && !newCommission){
            return orderDedctions.newProcurementPrice
        } else {
            return newCommission
        }
    }

    const getBackGroundColor = (option) => {
    }

    return (
        <>
            {status === 'SOLD' ?
                <Typography className={classes.margin} variant='h6'>Purchased For : {(orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo === 'CP') ? 'Channel Partner' : 'Store'}</Typography> :
                <FormControl className={classes.margin}>
                    <Typography variant='h6'>Purchased For </Typography>
                    <NativeSelect
                        style={{ width: '25rem', margin: '0 1.5rem ' }}
                        id="demo-customized-select-native"
                        value={option}
                        onChange={handleChange}
                        input={<BootstrapInput />}
                    >
                        <option value='Channel Partner'>Channel Partner</option>
                        <option value='Store'>Store</option>
                    </NativeSelect>
                    <Button variant='contained' onClick={overrideTheOriginal} style={{ backgroundColor: !overrideColor ? '#979797' : '#47B26C', color: '#FFFFFF', boxShadow: 'none' }}>Override</Button>
                </FormControl>
            }
            <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'flex-start', gap: '1rem 2rem' }}>
                {
                    showCp &&
                    <>
                        <div>
                            <TableContainer component={Paper} style={{ width: '27rem', borderRadius: '13px', height: '9rem', marginBottom: '2rem' }}>
                                <Typography variant='subtitle1' className={classes.tableHeader}>Add Commission</Typography>
                                <Table size='small' className={classes.table} style={{ marginTop: '1rem' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Extra Commission</TableCell>
                                            <TableCell>
                                                <TextField variant='outlined' disabled={enable} value={extraCommission} onChange={onCommissionChange} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>City Commission</TableCell>
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value={orderDedctions.cityLevelCommission} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TableContainer component={Paper} style={{ marginBottom: '2rem', width: '27rem', borderRadius: '13px', paddingBottom: '1rem' }}>
                                <Typography variant='subtitle1' className={classes.tableHeader}> Add Deductions </Typography>
                                <Table size='small' className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Channel Partner</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Leeway</TableCell>
                                            <TableCell>
                                                <TextField variant='outlined' value={leeway} onChange={onLeewayChange} disabled={enable} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled  value={0} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Traffic Challan</TableCell>
                                            <TableCell>
                                                <TextField variant='outlined' value={trafficChallan} onChange={onTrafficChallanChange} disabled={enable} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value={orderDedctions && orderDedctions.userDeductions && orderDedctions.userDeductions.userTrafficChalan && orderDedctions.userDeductions.userTrafficChalan ? orderDedctions.userDeductions.userTrafficChalan : 0} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>HP/RTO Charges</TableCell>
                                            <TableCell>
                                                <TextField variant='outlined' value={hpRto} onChange={onHpRtoChange} disabled={enable} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value={orderDedctions && orderDedctions.userDeductions && orderDedctions.userDeductions.userHpRtoCharges ? orderDedctions.userDeductions.userHpRtoCharges : 0}  />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Doc QC2 Charges</TableCell>
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value={docQc2Charges} /> 
                                                {/* <TextField variant='outlined' value={docQc2Charges} onChange={oDocQc2ChargesChange} disabled={enable} /> */}
                                            </TableCell>
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value={orderDedctions && orderDedctions.docQc2Deductions && orderDedctions.docQc2Deductions ? orderDedctions.docQc2Deductions : 0} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Comments</TableCell>
                                            <TableCell colSpan={2} rowSpan={2}>
                                                <TextField rows={3} multiline variant='outlined' className={classes.commentInput} placeholder='Enter Comments' value={comments} onChange={onCommentsChange} disabled={enable} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <TableContainer component={Paper} style={{ width: '27rem', borderRadius: '13px', paddingBottom: '1rem', marginBottom: '2rem', height: '14rem' }}>
                            <Typography variant='subtitle1' className={classes.tableHeader}>Totals</Typography>
                            <Table size='small' className={classes.table}>
                                {!showStore &&
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Channel Partner</TableCell>
                                        </TableRow>
                                    </TableHead>}
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Highest Bid</TableCell>
                                        <TableCell>
                                            <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {orderDedctions && orderDedctions.highestBid ? getAmount(orderDedctions.highestBid) : getAmount(0)} />
                                        </TableCell>
                                        {!showStore &&
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {orderDedctions && orderDedctions.highestBid ? getAmount(orderDedctions.highestBid) : getAmount(0)} />
                                            </TableCell>}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Deductions<Chip size='small' label='-' style={{ backgroundColor: '#DA2128', color: 'white', position: 'relative', right: "-1.6rem", fontSize: 'x-large' }} /></TableCell>
                                        <TableCell>
                                            <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {getAmount(totalDeductionCustomer())} />
                                        </TableCell>
                                        {!showStore &&
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {getAmount(totalDeductionCP())} />
                                            </TableCell>}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Final Amount<Chip size='small' label='=' style={{ backgroundColor: '#47B26C', color: 'white', position: 'relative', right: "-2.9rem", fontSize: 'large' }} /></TableCell>
                                        <TableCell>
                                            <TextField variant='filled' InputProps={{ disableUnderline: true }} style={{ backgroundColor: '#93CC99' }}  disabled value= {getAmount(finalAmtCustomer())} />
                                        </TableCell>
                                        {!showStore &&
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }} style={{ backgroundColor: '#93CC99' }}  disabled value= {getAmount(finalAmtCP())} />
                                            </TableCell>}
                                    </TableRow>
                                </TableBody>
                            </Table>
                            {(finalAmtCustomer() < 0 || finalAmtCP() < 0) && <FormHelperText style={{ color: 'red', marginRight: '1rem', textAlign: 'end' }}>Negative value detected for Final Amount!</FormHelperText>}
                        </TableContainer>
                    </>
                }

                {
                    showStore &&
                    <>
                        <div>
                            <TableContainer component={Paper} style={{ marginBottom: '2rem', width: '27rem', borderRadius: '13px', paddingBottom: '1rem' }}>
                                <Typography variant='subtitle1' className={classes.tableHeader}> Add Deductions </Typography>
                                <Table size='small' className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Customer</TableCell>
                                            {/* <TableCell>Channel Partner</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Leeway</TableCell>
                                            <TableCell>
                                                <TextField variant='outlined' value={leeway} onChange={onLeewayChange} disabled={enable} />
                                            </TableCell>
                                            <TableCell>
                                                {/* <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {orderDedctions && orderDedctions.leeway && orderDedctions.leeway ? orderDedctions.leeway : 0} /> */}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Traffic Challan</TableCell>
                                            <TableCell>
                                                <TextField variant='outlined' value={trafficChallan} onChange={onTrafficChallanChange} disabled={enable} />
                                            </TableCell>
                                            <TableCell>
                                                {/* <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {orderDedctions && orderDedctions.userDeductions && orderDedctions.userDeductions.userTrafficChalan && orderDedctions.userDeductions.userTrafficChalan ? orderDedctions.userDeductions.userTrafficChalan : 0} /> */}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>HP/RTO Charges</TableCell>
                                            <TableCell>
                                                <TextField variant='outlined' value={hpRto} onChange={onHpRtoChange} disabled={enable} />
                                            </TableCell>
                                            <TableCell>
                                                {/* <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {orderDedctions && orderDedctions.userDeductions && orderDedctions.userDeductions.userHpRtoCharges ? orderDedctions.userDeductions.userHpRtoCharges : 0}  /> */}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Doc QC2 Charges</TableCell>
                                            <TableCell>
                                                <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {docQc2Charges} />
                                                {/* <TextField variant='outlined' value={docQc2Charges} onChange={oDocQc2ChargesChange} disabled={enable} /> */}
                                            </TableCell>
                                            <TableCell>
                                                {/* <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {orderDedctions && orderDedctions.docQc2Deductions && orderDedctions.docQc2Deductions ? orderDedctions.docQc2Deductions : 0} /> */}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Comments</TableCell>
                                            <TableCell colSpan={2} rowSpan={2}>
                                                <TextField rows={3} multiline variant='outlined' className={classes.commentInput} placeholder='Enter Comments' value={comments} onChange={onCommentsChange} disabled={enable} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TableContainer component={Paper} style={{ width: '27rem', borderRadius: '13px', height: '9rem' }}>
                                <Typography variant='subtitle1' className={classes.tableHeader}>Add Price</Typography>
                                <Table size='small' className={classes.table} style={{ marginTop: '1rem' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Procurement Price</TableCell>
                                            <TableCell>
                                                <Button variant='contained' disabled>{orderDedctions && orderDedctions.storeProcuredPrice && orderDedctions.storeProcuredPrice ? orderDedctions.storeProcuredPrice : 0}</Button>
                                                {/* <TextField variant='outlined' value={extraCommission} onChange={onCommissionChange} disabled /> */}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>New Procurement Price</TableCell>
                                            <TableCell>
                                                <TextField variant='outlined' placeholder={orderDedctions && orderDedctions.newProcurementPrice ? orderDedctions.newProcurementPrice : 0} value={newCommission} onChange={onNewCommissionChange} disabled={enable} />
                                            </TableCell>
                                        </TableRow>
                                        {showNewCommissionError &&
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>
                                                    <FormHelperText style={{ color: 'red' }}> *Please enter new procurement price </FormHelperText>
                                                </TableCell>
                                            </TableRow>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <TableContainer component={Paper} style={{ width: '27rem', borderRadius: '13px', paddingBottom: '1rem', marginBottom: '2rem', height: '14rem' }}>
                            <Typography variant='subtitle1' className={classes.tableHeader}>Totals</Typography>
                            <Table size='small' className={classes.table}>
                                
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Customer</TableCell>
                                        </TableRow>
                                    </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Procurement Price</TableCell>
                                        <TableCell>
                                            <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {getAmount(getProcurementPrice())} />
                                        </TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Deductions<Chip size='small' label='-' style={{ backgroundColor: '#DA2128', color: 'white', position: 'relative', right: "-6rem", fontSize: 'x-large' }} /></TableCell>
                                        <TableCell>
                                            <TextField variant='filled' InputProps={{ disableUnderline: true }}  disabled value= {getAmount(totalDeductionCus())} />
                                        </TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Final Amount<Chip size='small' label='=' style={{ backgroundColor: '#47B26C', color: 'white', position: 'relative', right: "-7.3rem", fontSize: 'large' }} /></TableCell>
                                        <TableCell>
                                        <TextField variant='filled' InputProps={{ disableUnderline: true }} style={{ backgroundColor: '#93CC99',color:'black' }}  disabled value={getAmount(finalAmtStore())} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            {(finalAmtStore() < 0) && <FormHelperText style={{ color: 'red', marginRight: '1rem', textAlign: 'end' }}>Negative value detected for Final Amount!</FormHelperText>}
                        </TableContainer>
                    </>
                }
            </div>
        </>
    )
}

