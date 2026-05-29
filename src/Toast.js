import React, { useEffect, useState } from 'react'
import { useGlobalContext } from './context'

const Toast = () => {
  const { toast } = useGlobalContext()
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [isHiding, setIsHiding] = useState(false)

  useEffect(() => {
    if (toast) {
      setMessage(toast.message)
      setVisible(true)
      setIsHiding(false)

      const hideTimer = setTimeout(() => {
        setIsHiding(true)
        
        const removeTimer = setTimeout(() => {
          setVisible(false)
        }, 400) // matches our App.css CSS fade-out transition
        
        return () => clearTimeout(removeTimer)
      }, 2600) // display duration

      return () => clearTimeout(hideTimer)
    }
  }, [toast])

  if (!visible) return null

  return (
    <div className="toast-container">
      <div className={`toast-notification ${isHiding ? 'hide' : ''}`} role="alert">
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '2.2rem' }}>
          auto_awesome
        </span>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Toast
