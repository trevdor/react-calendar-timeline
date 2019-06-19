import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames';

import { iterateTimes } from '../utility/calendar'
import { TimelineStateConsumer } from '../timeline/TimelineStateContext'

const passThroughPropTypes = {
  canvasTimeStart: PropTypes.number.isRequired,
  canvasTimeEnd: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  lineCount: PropTypes.number.isRequired,
  minUnit: PropTypes.string.isRequired,
  timeSteps: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  verticalLineClassNamesForTime: PropTypes.func
}

class Columns extends PureComponent {
  static propTypes = {
    ...passThroughPropTypes,
    getLeftOffsetFromDate: PropTypes.func.isRequired
  }

  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      height,
      verticalLineClassNamesForTime,
      getLeftOffsetFromDate
    } = this.props

    let lines = []

    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      (time, nextTime) => {
        const minUnitValue = time.get(minUnit === 'day' ? 'date' : minUnit)
        const firstOfType = minUnitValue === (minUnit === 'day' ? 1 : 0)
        const timeMillis = time.valueOf();
        const nextTimeMillis = nextTime.valueOf();

        let classNamesForTime = []
        if (verticalLineClassNamesForTime) {
          classNamesForTime = verticalLineClassNamesForTime(
            timeMillis,
            nextTimeMillis - 1
          )
        }

        // TODO: rename or remove class that has reference to vertical-line
        const lineClassNames = classNames(
          'rct-vl',
          {
            'rct-vl-first': firstOfType,
            [`rct-day-${time.day()}`]:
              minUnit === 'day' || minUnit === 'hour' || minUnit === 'minute'
          },
          ...classNamesForTime
        )

        const left = getLeftOffsetFromDate(timeMillis)
        const right = getLeftOffsetFromDate(nextTimeMillis)
        lines.push(
          <div
            key={`line-${timeMillis}`}
            className={lineClassNames}
            style={{
              pointerEvents: 'none',
              top: '0px',
              left: `${left}px`,
              width: `${right - left}px`,
              height: `${height}px`
            }}
          />
        )
      }
    )

    return <div className="rct-vertical-lines">{lines}</div>
  }
}

const ColumnsWrapper = ({ ...props }) => {
  return (
    <TimelineStateConsumer>
      {({ getLeftOffsetFromDate }) => (
        <Columns getLeftOffsetFromDate={getLeftOffsetFromDate} {...props} />
      )}
    </TimelineStateConsumer>
  )
}

ColumnsWrapper.defaultProps = {
  ...passThroughPropTypes
}

export default ColumnsWrapper