import React from 'react'
import CountDownTimer from 'react-countdown-now'
import moment from 'moment'
import { RadioButtonChecked } from '@material-ui/icons';

const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        return <p style={{ color: '#DA2128',fontWeight:'600',fontSize:'12px', }}>ENDED</p>;
    } else {
        return <div style={{display:'flex',alignItems:'center',marginTop:'5px'}}>
            <RadioButtonChecked style={{ color: '#DA2128' ,fontSize:'13px'}} />
            <p style={{ color: '#DA2128' ,fontWeight:'600',fontSize:'12px', paddingLeft:'3px',}}>LIVE</p>
            <p style={{fontWeight:'600',fontSize:'12px', padding: '0 5px', display: "inline-block",marginTop:'0px'}}>{`${minutes}M:${seconds}S`}</p>
        </div>
    }
}

const Timer = ({ time }) => (
    <CountDownTimer
        date={moment(time).toDate()}
        renderer={renderer}
    />
)

export default Timer