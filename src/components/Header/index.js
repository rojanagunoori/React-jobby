import Cookies from 'js-cookie'
import {Redirect, Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
    return <Redirect to="/login" />
  }

  return (
    <div className="header-container">
      <li>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>
      </li>
      <ul className="header-ul">
        <li>
          <Link className="link" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="link">
            Jobs
          </Link>
        </li>
      </ul>
      <button onClick={onClickLogout} type="button" className="header-button">
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
