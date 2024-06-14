import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', isError: false, errorMsg: ''}

  onSuccessDetails = jwtToken => {
    this.setState({isError: false})
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    const {history} = this.props
    history.replace('/')
  }

  onFailureDetails = errorMsg => {
    this.setState({isError: true, errorMsg})
  }

  getDetails = async () => {
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.onSuccessDetails(data.jwt_token)
    } else {
      this.onFailureDetails(data.error_msg)
    }
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmitForm = e => {
    e.preventDefault()
    this.getDetails()
  }

  render() {
    const {username, password, isError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    console.log(token)
    if (token !== undefined) return <Redirect to="/" />

    return (
      <div className="login-container">
        <form onSubmit={this.onSubmitForm} className="login-form">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />
          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <input
            type="text"
            className="input"
            id="username"
            value={username}
            onChange={this.onChangeUsername}
            placeholder="Username"
          />
          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <input
            type="password"
            className="input"
            id="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
          />
          <p className="show">username1:rahul,password1:rahul@2021</p>
          <p className="show">username2:raja,password2:raja@2021</p>
          <button type="submit" className="login-button">
            Login
          </button>
          {isError && (
            <small>
              <p className="login-para">* {errorMsg}</p>
            </small>
          )}
        </form>
      </div>
    )
  }
}
export default Login
