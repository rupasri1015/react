import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tabs, Tab, Box, Card, CardContent, Table, makeStyles, TableCell, TableContainer, TableHead, TableRow, Typography, TableBody, Paper, ListItem, ListItemIcon, ListItemText, List } from '@material-ui/core';
import { getDate, renderString } from '../../../../../core/utility';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    appbar: {
        position: 'relative',
        top: '-1.5rem',
        margin: '0 auto',
        backgroundColor: '#F4F7FD',
        opacity: '1',
        '& .MuiTabs-flexContainer': {
            justifyContent: 'center',
            "&[aria-selected = 'true']": {
                backgroundColor: 'white',
            }
        }
    },
    rootTable: {
        width: '25rem',
        marginBottom: '2rem'
    },
    table: {
        '& .MuiTableCell-root': {
            borderBottom: 'none',
            padding: '7px 30px 0px 20px'
        },
    },
    cell: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    issueTable: {
        borderRadius: '1.5rem',
        tableLayout: 'auto',
        '& .MuiTableHead-root': {
            backgroundColor: '#E8E8E8',
        },
        // '& .MuiTableHead-'
    },
    issueHeadCell: {
        fontSize: 'large',
        fontWeight: '500',
    },
    lister:{
        '& .MuiListItem-dense':{
            padding:'0 10px'
        }
    }
}));

export default function ScrollableTabsButtonAuto({ InspectionData }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const { valuatorInfo, orderInfo, customerInfo, imagesList } = InspectionData

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const allOkayData = imagesList && imagesList.filter(val => val.leadParameterValue === "No issues" && val.leadParameterType === 'SINGLE')
    const issueData = imagesList && imagesList.filter(val => val.leadParameterType === "SINGLE" && val.leadParameterValue !== 'No issues')

    return (
        <div className={classes.root}>
            <AppBar elevation='none' color='default' className={classes.appbar}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    variant="standard"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="Issues" {...a11yProps(1)} />
                    <Tab label="All Okay" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Card className={classes.roottable} style={{ width: '30rem' }}>
                    <CardContent>
                        <Table className={classes.table}>
                            <TableContainer >
                                <TableHead >
                                    <TableRow>
                                        <TableCell className={classes.cell}>ADIY By</TableCell>
                                        <TableCell >{valuatorInfo && valuatorInfo.adiyBy && renderString(valuatorInfo.adiyBy)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>ADIY Date</TableCell>
                                        <TableCell >{valuatorInfo && valuatorInfo.adiyDate && getDate(renderString(valuatorInfo.adiyDate))}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>Inspected By</TableCell>
                                        <TableCell >{valuatorInfo && valuatorInfo.userName && renderString(valuatorInfo.userName)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.cell}>Inspection Date</TableCell>
                                        <TableCell >{orderInfo && orderInfo.leadCreateAt && getDate(renderString(orderInfo.leadCreateAt))}</TableCell>
                                    </TableRow>
                                </TableHead>
                            </TableContainer>
                        </Table>
                    </CardContent>
                </Card>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TableContainer component={Paper} style={{ width: '35rem', maxHeight: '70vh' }}>
                    <Table className={classes.issueTable} size='small'>
                        <TableHead>
                            <TableRow >
                                <TableCell className={classes.issueHeadCell}>Parameter</TableCell>
                                <TableCell className={classes.issueHeadCell}>Symptoms</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {issueData && issueData.map((val) => (
                                <TableRow key={val} style={{ height: '3rem' }}>
                                    <TableCell style={{ fontWeight: '500', width: '35%' }}>{val.leadParameterName}</TableCell>
                                    <TableCell >
                                        <List dense disablePadding ={true} className={classes.lister}>
                                            {val.leadParameterValue.split('\n').map((item) => (
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <ArrowRightIcon />
                                                    </ListItemIcon>
                                                    <ListItemText style={{margin:'0px'}} primary={item} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <TableContainer component={Paper} style={{ width: '25rem', height: '70vh' }}>
                    <Table size='small' className={classes.issueTable}>
                        <TableHead>
                            <TableRow >
                                <TableCell className={classes.issueHeadCell} style={{ width: '10rem' }}>Parameter</TableCell>
                                <TableCell className={classes.issueHeadCell} align='right' >Symptom</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allOkayData && allOkayData.map((val) => (
                                <TableRow key={val} style={{ height: '3rem' }}>
                                    <TableCell style={{ fontWeight: '500', width: '60%' }}>{val.leadParameterName}</TableCell>
                                    <TableCell align='right'>{val.leadParameterValue}</TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

        </div>
    );
}
