import React from 'react'
import CountDownTimer from 'react-countdown-now'
import moment from 'moment'

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <p style={{ color: 'red' }}>ENDED</p>;
  } else {
    return <div>
      <p style={{ color: 'red' }}>LIVE</p>
      <p style={{ padding: 5, border: "1px dashed black", borderRadius: 5, display: "inline-block", marginBottom: 10, marginTop: 0 }}>{`${minutes}M:${seconds}S`}</p>
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