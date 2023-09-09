import React from 'react'
import './Footer.css'
import Wave from './img/wave.png'

const Footer = () => {
  return (

    <div className="footer">
        <img src={Wave} alt="" style={{width:'100%',color:"#F5380D"}} />

        <div className="f-content">
            <span>sajalgupta0019@gmail.com</span>
            <span>+91 8192046262</span>
            <span>All the rights reserverd to Sajal Gupta</span>
        </div>
        
    </div>
    
  )
}

export default Footer