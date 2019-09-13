import React, { useReducer, useEffect } from 'react';
import './App.css';

const formatWithZero = (unit) => unit < 10 ? '0' + unit : String(unit)
const formatTime = (timeInMiliSeconds) => {
  const mins = Math.floor(timeInMiliSeconds / 6000)
  const sec = Math.floor((timeInMiliSeconds / 100) % 60)
  const milisec = Math.floor(((timeInMiliSeconds) % 100))
  return `${formatWithZero(mins)}:${formatWithZero(sec)}.${formatWithZero(milisec)}`
}

const initialState = { isRunning: false, timeElapsed: 0, previousTime: 0, lapTime: [] }
const statStop = 'statStop'
const lapReset = 'lapReset'
const incrementTimer = 'incrementTimer'

const getMinLap = (laps) => Math.min.apply(Math, laps)
const getMaxLap = (laps) => Math.max.apply(Math, laps)

const reducer = (state, action) => {
  switch (action) {
    case statStop:
      return { ...state, isRunning: !state.isRunning }
    case incrementTimer:
      return { ...state, timeElapsed: state.timeElapsed + 1 }
    case lapReset:
      if (!state.isRunning) {
        return { isRunning: false, timeElapsed: 0, previousTime: 0, lapTime: [] }
      } else {
        return {
          ...state,
          previousTime: state.timeElapsed,
          lapTime: [state.timeElapsed - state.previousTime, ...state.lapTime]
        }
      }
    default:
      throw new Error()
  }
}

// must be outside app component, otherwise it loop again
let interval

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.isRunning) {
      interval = setInterval(() =>
        dispatch(incrementTimer)
        , 10)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval()
  }, [state.isRunning])

  const { isRunning, timeElapsed, lapTime } = state
  const startStopLblChange = isRunning ? 'Stop' : 'Start'
  const lapRestetLblChange = isRunning || timeElapsed === 0 ? 'Lap' : 'Reset'

  const min = getMinLap(lapTime)
  const max = getMaxLap(lapTime)
  return (
    <div className='container'>
      <h1 className='time'>{formatTime(timeElapsed)}</h1>
      <div className='button'>
        <button className='button_item' onClick={() => dispatch(lapReset)}>{lapRestetLblChange}</button>
        <button className='button_item' onClick={() => dispatch(statStop)}>{startStopLblChange}</button>
      </div>
      <table className='timer__table'>
        <tbody>
          {lapTime.map((lap, index) => {
            let rowClass = ''
            if (lapTime.length > 2) {
              if (lap === min) {
                rowClass = 'fastest'
              } else if (lap === max)
                rowClass = 'slowest'
            }
            return <tr className={rowClass} key={index}>
              <td>Lap {lapTime.length - index} </td>
              <td>{formatTime(lap)}</td>
            </tr>
          }
          )}
        </tbody>
      </table>
    </div>
  );
}
export default App;

