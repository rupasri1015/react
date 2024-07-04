import React, { Component } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getFirstName, getLastName, getEmail, getAltNumber, getImage, getDob } from '../../../core/services/userInfoStorageServices'
import { Button } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import Slide from '@material-ui/core/Slide';
import Close from '@material-ui/icons/Close';
import StarRate from '@material-ui/icons/StarRate';
import Typography from '@material-ui/core/Typography';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});


class PopUpDialog extends Component {

    state = {
        isModelOpen: false

    }
    fields = {
        first_name: getFirstName(),
        last_name: getLastName(),
        u_dob: getDob(),
        u_email: getEmail()

    }

    handleClickOpen = () => {
        this.setState({ isModelOpen: true });
    }

    handleClose = () => {
        this.setState({ isModelOpen: false });
    }

    handleUpdate = () => {
        const { history } = this.props
        this.setState({ isModelOpen: false });
        history.push('/updateprofile')
    }

    componentDidMount() {
        if (getEmail() === "" || getFirstName() === ""|| getLastName() === ""){ //|| getDob() === "") {
                        this.handleClickOpen()
        }
    }

    render() {
        return (
            <Dialog
                open={this.state.isModelOpen}
                // onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                TransitionComponent={Transition}
                maxWidth='sm'
               fullWidth={true}
            >
                 <DialogTitle id="alert-dialog-title" style={{ marginTop: '0px', backgroundColor: "#111328", color: "white" }}>
                   {/* <Button close onClick={this.handleClose} style={{ cursor: 'pointer', color: "white", margin: "auto" }} /> */}
                    <Typography variant="h6"  >
                       Incomplete Profile
                    </Typography>
                </DialogTitle>
                <DialogContent>
                <p className="mt-10 text-justify" style={{ fontWeight: "bold" }}>

                        <Typography style={{ fontWeight: "bold" }}>Please fill these information in your user profile :</Typography><br />
                            {
                                !this.fields.first_name &&
                                <>
                                    <StarRate style={{ padding: "4px" }} /> First Name<br/>
                                </>

                            }
                            {
                                !this.fields.last_name &&
                                <>
                                    <StarRate style={{ padding: "4px" }} />Last Name<br/>
                                </>

                            }
                            {
                                !this.fields.u_email &&
                                <>
                                    <StarRate style={{ padding: "4px" }} />Email<br/>
                                </>
                            }
                            {/* {
                                !this.fields.u_dob &&
                                <>
                                    <StarRate style={{ padding: "4px" }} />Date Of Birth<br/>
                                </>
                            } */}
                    </p>
                </DialogContent>
                            <DialogActions style={{ margin: 'auto', marginTop: '5px' }}>
                    {/* <Button onClick={this.handleClose} className="btn btn-dark" >
                Close
              </Button> */}
              <Button onClick={this.handleUpdate} color="success" >
                         Continue
                     </Button>
                </DialogActions>
            </Dialog>
        );

    }
}
export default withRouter(PopUpDialog);