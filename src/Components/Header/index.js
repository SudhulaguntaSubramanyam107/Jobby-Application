import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props
  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  const toHome = () => {
    history.replace('/')
  }
  const toJobs = () => {
    history.replace('/jobs')
  }
  return (
    <div className="head">
      <Link to="/" className="link logoHead">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logoH"
          onClick={toHome}
        />
      </Link>
      <ul className="list">
        <li>
          <Link to="/" className="link">
            <a className="ph" href={toHome}>
              Home
            </a>
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="link">
            <a className="ph" href={toJobs}>
              Jobs
            </a>
          </Link>
        </li>
        <li id="headButton">
          <button type="button" onClick={onLogout} id="headButton">
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
