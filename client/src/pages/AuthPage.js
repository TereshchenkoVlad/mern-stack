import React, { useState, useEffect, useContext } from 'react'
import './styles/AuthPage.scss'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'
 

const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const { loading, error, request, clearError } = useHttp()
  const [form, setForm] = useState({
    email: '', password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = event => {
    setForm({ 
      ...form, 
      [event.target.name]: event.target.value 
    })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      message(data.message)
    } catch (e) {}
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch (e) {}
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3 auth">

        <h1>Cut the link!</h1>

        <div className="card ">
          <div className="card-content black-text">
            <span className="card-title auth-title">Authorization</span>
            <div className="auth__inputs">

              <div className="input-field">
                <input 
                  placeholder="Enter the email..." 
                  id="email" 
                  type="text" 
                  className="auth__inputs-email"
                  name="email"
                  onChange={changeHandler}
                  value={form.email}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input 
                  placeholder="Enter the password..." 
                  id="password" 
                  type="password" 
                  name="password"
                  onChange={changeHandler}
                  value={form.password}
                />
                <label htmlFor="password">Password</label>
              </div>

            </div>
          </div>
          <div className="card-action">
            <button 
              disabled={loading}
              onClick={loginHandler}
              className="btn pink auth__btn-login">Log in</button>
            <button 
              className="btn teal accent-4" 
              disabled={loading}
              onClick={registerHandler}>Register</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AuthPage
