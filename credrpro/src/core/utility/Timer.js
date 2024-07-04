import React from "react"

export default class Countdown extends React.Component {

    constructor(props) {
        super(props)
        this.state = this.calculateCountdown(props.date)
    }

    componentDidMount() {
        // update every second
        this.interval = setInterval(() => {
            const date = this.calculateCountdown(this.props.date)
            if (date) {
                this.setState(date)
            } else {
                this.stop()
                this.props.onComplete()
            }
        }, 1000)
    }

    componentWillUnmount() {
        this.stop()
    }

    calculateCountdown = (endDate) => {
        let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;
        this.props.onEpoch(Date.parse(new Date(endDate)) - Date.parse(new Date()))
        // clear countdown when date is reached
        if (diff < 0) return false;

        const timeLeft = {
            min: `0 Minute`,
            sec: `0 Second`
        }

        // calculate time difference between now and expected date
        const min = Math.floor(diff / 60)
        if (diff >= 60) {
            if (min > 1) {
                timeLeft.min = `${min} Minutes`
            } else {
                timeLeft.min = `${min} Minute`
            }
        }
        diff -= min * 60
        if (diff > 1) {
            timeLeft.sec = `${diff} Seconds`
        } else {
            timeLeft.sec = `${diff} Second`
        }
        return timeLeft;
    }

    stop = () => {
        clearInterval(this.interval)
    }

    addLeadingZeros(value) {
        value = String(value);
        while (value.length < 2) {
            value = '0' + value;
        }
        return value;
    }

    render() {
        const countDown = this.state;
        const { className, style } = this.props
        return (
            <div className={className} style={style}>
                <p>{countDown.min} {countDown.sec}</p>
            </div>
        )
    }
}