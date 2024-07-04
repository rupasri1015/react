import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Collapse } from 'reactstrap'
import TopbarMenuLink from './TopbarMenuLink'
import DownIcon from '../.././../shared/img/icons/down-arrow.svg'
import { logout } from '../../../core/services/authenticationServices'
import { getUserName, getRole, getUserID } from '../../../core/services/rbacServices'
import { getFirstName, getLastName, getEmail, clearUserInfo, getImage } from '../../../core/services/userInfoStorageServices'
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Edit from '@material-ui/icons/Edit';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import Upload from '../../../shared/components/form/Upload'
import { updateProfileImage } from '../../../core/services/miscServices'
import { setImage } from '../../../core/services/userInfoStorageServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Slide from '@material-ui/core/Slide'



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({

  button: {
    // margin: theme.spacing(1),
    marginBottom: '0px',
    marginTop: '25px',
    left: '5px',
    right: '5px',
    width: '150px',
    height: '50px'
  },
  button1: {
    // margin: theme.spacing(1),
    marginBottom: '0px',
    marginTop: '25px',
    left: '5px',
    right: '5px',
    width: '100px',
    height: '50px',
    color: '#bc292f'

  },
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    // alignSelf: 'center',
    margin: '100px',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5px',
    marginTop: '0px'
  },
  updatepicsize: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    // alignSelf: 'center',
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      background: "#BC292F",
    },
  },
  iconsize: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    // alignSelf: 'center',
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#3bc292f',

  },

  marginAutoItem: {
    margin: 'auto'
  },

}));

const TopbarProfile = () => {

  const dispatch = useDispatch()

  const [collapse, setCollapse] = useState(false)
  const history = useHistory()
  const location = useLocation()
  console.log(location)
  const [isModelOpen, setValue] = useState(false)
  const [imageurls, setImageUrl] = useState([]);

  const logoutHandler = () => {
    logout()
    clearUserInfo()
    history.push('/login')
  }
  const profileHandler = () => {
    // logout()
    history.push({
      pathname: '/updateprofile',
      state: {
        prevLocation: location.pathname
      }
    }
    );
    //   setTimeout(() => {
    //     history.push('/updateprofile')
    // }, 400) 
    // window.location.reload(false);

  }
  const handleClickOpen = () => {
    setValue(true);
  }

  const handleClose = () => {
    setValue(false);
  }

  const handleUpdate = () => {
    const { history } = this.props
    history.push('/updateprofile')


  }
  const fileChangedHandler = (files) => {
    if (files.length) {
      uploadImagesForDelvivery(files)
        .then(message => {
          if (message) {
            const newUrls = message
            setImage(newUrls)
            handleClose()
          }
        })
    }
  }

  const uploadImagesForDelvivery = images => {
    const formData = new FormData()
    images.forEach(file => {
      formData.append('file', file)
    })
    formData.append('userId', getUserID())
    return updateProfileImage(formData)
      .then(apiResponse => {
        if (apiResponse.isValid) {

          return apiResponse.message
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
          return null
        }
      })
  }


  const classes = useStyles();

  return (
    <div className="topbar__profile">
      <button type="button" className="topbar__avatar" onClick={() => setCollapse(!collapse)}>
        <Avatar className="topbar__avatar-img" alt={getUserName()} src={getImage()}>
        </Avatar>&nbsp;
        <p className="topbar__avatar-name">{getFirstName()}&nbsp; </p>
        <img src={DownIcon} alt="Arrow Down" className="topbar-down-arrow" />
      </button>
      {collapse && <button type="button" className="topbar__back" onClick={() => setCollapse(!collapse)} />}
      <Collapse isOpen={collapse} style={{ width: "300px", height: "300px", radius: '25px' }} className="topbar__menu-wrap">
        <div className="topbar__menu" style={{ borderRadius: "5px" }}>
          <Badge
            className={classes.large}
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={<Avatar className={classes.updatepicsize}><PhotoCamera className={classes.iconsize} onClick={() => handleClickOpen()} /></Avatar>}
          >
            <Avatar className={classes.large} alt={getUserName()} src={getImage()} />

          </Badge>
          <div className="text-center">
            <label><b>{getFirstName()}&nbsp;{getLastName() === '' ? '' : getLastName()}</b></label><br />
            <small>{getEmail() === 'null' ? '' : getEmail()}</small><br />
          </div>
          <div className="row">
            <div className="col-lg-6">

              <Button
                // variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<Edit >Update Profile</Edit>}
                onClick={profileHandler}
              >
                <small>Update Profile</small>
              </Button>

            </div>
            <div className="col-lg-6">

              <Button
                // variant="contained"
                color="primary"
                className={classes.button1}
                startIcon={<ExitToApp>LogOut</ExitToApp>}
                onClick={logoutHandler}
              >
                <small>LogOut</small>
              </Button>
            </div>

          </div>
        </div>
      </Collapse>
      <div>

        <Dialog
          open={isModelOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          TransitionComponent={Transition}

        >
          <DialogContent>
            <div className="col-12">

              <Upload
                accept="image/*"
                onFileChange={(files) => fileChangedHandler(files)}
                label="Upload Profile Image"
              />
              
              Browse Image


            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>

          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default TopbarProfile