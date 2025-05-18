import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'
const AppDownload = () => {
  return (
    <div className='app-download' id="app-download">
      <p>For better Experience Download <br/> Tomato App</p>
      <div className="app-download-platforms"></div>
      <img src={assets.play_store} alt="" />
      <img src={assets.app_store} alt="" />
    </div>
  )
}

export default AppDownload
