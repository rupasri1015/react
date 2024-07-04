import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Slide from '@material-ui/core/Slide';
import SelectField from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import { Button } from 'reactstrap'
import { reduxForm, Field } from 'redux-form'
import validate from './validate'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RenderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
    <FormControl className='w-100'>
      <TextField
        label={label}
        error={touched && Boolean(error)}
        {...input}
        {...custom}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

const RenderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
    <FormControl className='w-100'>
      <InputLabel style={{ color: error && touched ? '#c00' : '' }}>{label}</InputLabel>
      <SelectField
        label={label}
        error={touched && Boolean(error)}
        {...input}
        onChange={(event) => input.onChange(event.target.value)}
        children={children}
        {...custom}
        MenuProps={MenuProps}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

const onlyNumber = (value) => {
  if (!value) {
    return value
  }
  let onlyNumberData = value.replace(/[^\d]/g, '')
  onlyNumberData = onlyNumberData.replace(/(?!^)+/g, '')
  return onlyNumberData.startsWith('0') ? '' : onlyNumberData
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 225
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  }
}

class PublishForm extends Component {

  componentDidMount = () => {
    const { inventory, initialize } = this.props
    if (inventory) {
      const { price, storeId } = inventory
      const formdata = {}
      if (price) {
        formdata.rePublishedPrice = price
      }
      if (storeId) {
        formdata.storeId = storeId
      }
      this.setState({ prevData: formdata })
      initialize(formdata)
    }
  }

  submitForm = formdata => {
    const { valid, onSubmitForm, inventory } = this.props
    if (valid) {
      formdata.inventoryType = 'SHD'
      formdata.status = 'PUBLISHED'
      formdata.inspectedBikeDetailId = inventory.id
      formdata.inventoryPrice = inventory.price
      formdata.storeId = inventory.storeId
      onSubmitForm(formdata)
    }
  }

  closeForm = () => {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const { title, description, open, handleSubmit, stores } = this.props
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        onClose={this.closeForm}
      >
        <DialogTitle>{`${title}`}<span className="float-right" onClick={this.closeForm} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
        <form onSubmit={handleSubmit(this.submitForm)}>
          <DialogContent>
            <DialogContentText>
              {`${description}`}
            </DialogContentText>
            <div className="row">
              <div className="col-sm-6 mt-2">
                <Field
                  name="rePublishedPrice"
                  component={RenderTextField}
                  label="Enter Price"
                  normalize={onlyNumber}
                >

                </Field>
              </div>
              {/* <div className="col-sm-6 mt-2">
                <Field
                  name="storeId"
                  component={RenderSelectField}
                  label="Select Store"
                >
                  {
                    Boolean(stores && stores.length) &&
                    stores.map(store => <MenuItem value={store.storeId} key={store.storeId}>{store.storeName}</MenuItem>)
                  }
                </Field>
              </div> */}
            </div>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={this.closeForm} className="rounded no-margin" color="danger">
              Cancel
        </Button>
            <Button type="submit" className="rounded no-margin" color="success">
              Submit
        </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default reduxForm({
  form: 'publish-form',
  validate
})(PublishForm)