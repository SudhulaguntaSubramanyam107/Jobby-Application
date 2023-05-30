import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isError: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = error => {
    this.setState({isError: true, errorMsg: error})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    this.setState({username: '', password: ''})
    console.log(response)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    }
    if (response.status === 400) {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUser = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, isError, errorMsg} = this.state
    return (
      <div className="main">
        <div className="bg">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form onSubmit={this.onSubmitForm} className="form">
            <label htmlFor="name">USERNAME</label>
            <input
              type="text"
              id="name"
              value={username}
              onChange={this.onChangeUser}
              placeholder="Username"
            />
            <label htmlFor="passW">PASSWORD</label>
            <input
              type="password"
              id="passW"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Password"
            />
            <button type="submit" id="button">
              Login
            </button>
          </form>
          {isError && <p className="error">*{errorMsg}</p>}
        </div>
      </div>
    )
  }
}

export default Login
