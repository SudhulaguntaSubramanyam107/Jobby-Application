
import {Component} from 'react'
import {withRouter} from 'react-router-dom'

import './index.css'

class Register extends Component {
  state = {
    username: '',
    password: '',
    retypePassword: '',
    phoneNumber: '',
    msg: '',
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeRetypePassword = event => {
    this.setState({retypePassword: event.target.value})
  }

  onChangePhoneNumber = event => {
    this.setState({phoneNumber: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password, phoneNumber} = this.state
    const userData = {
      username,
      password,
      phoneNumber,
    }
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    }
    const url = 'http://localhost:3000/register'
    const response = await fetch(url, options)
    if (response.status === 200) {
      this.setState({msg: response.msg})
    } else {
      this.setState({msg: response.error_msg})
    }
  }

  render() {
    const {username, password, retypePassword, phoneNumber, msg} = this.state
    console.log(msg)
    return (
      <div className="registerDiv">
        <h1>Registration Form</h1>
        <form onSubmit={this.onSubmitForm} className="registerForm">
          <input
            type="text"
            value={username}
            placeholder="Enter Name"
            onChange={this.onChangeUserName}
          />
          <input
            type="password"
            value={password}
            placeholder="Enter Password"
            onChange={this.onChangePassword}
          />
          <input
            type="password"
            value={retypePassword}
            placeholder="Retype Password"
            onChange={this.onChangeRetypePassword}
          />
          <input
            type="text"
            value={phoneNumber}
            placeholder="Phone Number"
            onChange={this.onChangePhoneNumber}
          />
          <button type="submit">Register</button>
          <p>{msg}</p>
        </form>
        <div>
          <h1>
            Already existing user, <a href="/login">Login</a>
          </h1>
        </div>
      </div>
    )
  }
}

export default withRouter(Register)
