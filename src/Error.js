import React from 'react'
import { NavLink } from 'react-router-dom'

const Error = () => {
  return (
    <div className="error-page-wrapper">
      <h1 className="error-illustration" aria-label="404 error">404</h1>
      <h2 className="error-tag">Lost in the Cinematic Void?</h2>
      <p className="error-desc">
        The scene you are looking for has been cut, or the coordinates point to a deleted reel. Let's redirect you back to the main stage.
      </p>
      
      <NavLink to="/" className="btn-primary">
        <span className="material-symbols-outlined">theater_comedy</span>
        Back to CineVerse
      </NavLink>
    </div>
  )
}

export default Error