import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {GoSignOut} from 'react-icons/go'

import './index.css'

const logout = <GoSignOut color="#ffffff" size={20} />

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav>
      <div className="mobile-card">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-web-logo"
          />
        </Link>
        <ul className="header-card">
          <li className="header-nav-item">
            <Link to="/">
              <AiFillHome color="#ffffff" size={20} />
            </Link>
          </li>
          <li className="header-nav-item">
            <Link to="/jobs">
              <BsBriefcaseFill color="#ffffff" size={20} />
            </Link>
          </li>
          <li className="header-nav-item">
            <button
              type="button"
              className="logout-icon"
              onClick={onClickLogout}
            >
              {logout}
            </button>
          </li>
        </ul>
      </div>

      <ul className="desktop-container">
        <li className="header-nav-item">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="desktop-logo"
            />
          </Link>
        </li>
        <li className="desktop-card">
          <h1 className="desktop-heading">
            <Link to="/" className="header-link">
              Home
            </Link>
          </h1>
          <h1 className="desktop-heading">
            <Link to="/jobs" className="header-link">
              Jobs
            </Link>
          </h1>
        </li>
        <li className="header-nav-item">
          <button
            type="button"
            className="header-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
