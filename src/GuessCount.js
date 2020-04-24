import PropTypes from 'prop-types'
import React from 'react'

import './GuessCount.css'

const GuessCount = ({guesses}) => <div className="guesses">{guesses}</div>

//Definition des regles concernat les props
GuessCount.propTypes = {
    guesses: PropTypes.number.isRequired
}

export default GuessCount