import React from 'react'
import UIButton from '../UIButton/UIButton'
import './NoDataCard.css'

const NoDataCard = ({ message, buttonText, onClick }) => (
  <no-data-card>
    {message}
    <UIButton type="button" data-name={`NoDataCard ${buttonText}`} accent onClick={onClick}>
      {buttonText}
    </UIButton>
  </no-data-card>
)

export default NoDataCard



// WEBPACK FOOTER //
// ../src/components/NoDataCard/NoDataCard.js