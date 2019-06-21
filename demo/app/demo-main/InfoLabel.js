import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'

import './InfoLabel.scss'

function InfoLabel({ time }) {
  return <div className="rct-infolabel">{moment(time).format('LLL')}</div>
}

InfoLabel.propTypes = {
  time: PropTypes.object.isRequired
}

export default InfoLabel
