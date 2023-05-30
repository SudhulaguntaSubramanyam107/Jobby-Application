import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
  initial: 'INITIAL',
}
class Jobs extends Component {
  state = {
    profApiStatus: apiStatusConstants.initial,
    profDetails: '',
    jobsFetchedList: [],
    jobApiStatus: apiStatusConstants.initial,
    employeeType: '',
    minPackage: '',
    searchKey: '',
  }

  componentDidMount() {
    this.fetchProfile()
    this.fetchJobs()
  }

  fetchProfile = async () => {
    this.setState({profApiStatus: apiStatusConstants.loading})

    const profUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const upProfDetails = data.profile_details
      this.setState({
        profApiStatus: apiStatusConstants.success,
        profDetails: upProfDetails,
      })
    }
    if (response.status === 400) {
      this.setState({profApiStatus: apiStatusConstants.failure})
    }
  }

  fetchJobs = async () => {
    this.setState({jobApiStatus: apiStatusConstants.loading})
    const {employeeType, minPackage, searchKey} = this.state
    console.log(minPackage, searchKey)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType}&minimum_package=${minPackage}&search=${searchKey}`
    console.log(jobsUrl)
    const response = await fetch(jobsUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const {jobs, total} = data
      this.setState({
        jobsFetchedList: jobs,
        jobApiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 400) {
      this.setState({jobApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failCont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="btn2" type="button">
        Retry
      </button>
    </div>
  )

  noJobsView = () => (
    <div className="failCont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="failure"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
      <button className="btn2" type="button">
        Retry
      </button>
    </div>
  )

  renderJobs = newList => {
    const {jobApiStatus, jobsFetchedList} = this.state
    console.log(jobsFetchedList)
    switch (jobApiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        if (jobsFetchedList === []) {
          return this.noJobsView()
        }
        return (
          <div>
            <ul className="jobItems">
              {newList.map(eachItem => (
                <JobItem key={eachItem.id} jobItem={eachItem} />
              ))}
            </ul>
          </div>
        )
      default:
        return null
    }
  }

  retryFetch = () => {
    this.fetchJobs()
    this.fetchProfile()
  }

  renderProfile = () => {
    const {profApiStatus, profDetails} = this.state
    switch (profApiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return (
          <button className="btn2" type="button" onClick={this.retryFetch()}>
            Retry
          </button>
        )
      case apiStatusConstants.success:
        return (
          <div className="profCont">
            <img
              src={profDetails.profile_image_url}
              alt="profile"
              className="profLogo"
            />
            <h1>{profDetails.name}</h1>
            <p>{profDetails.short_bio}</p>
          </div>
        )
      default:
        return null
    }
  }

  searchChange = event => {
    this.setState({searchKey: event.target.value})
  }

  onSearchStart = () => {
    const {searchKey, jobsFetchedList} = this.state
    console.log(searchKey)
    const newList = jobsFetchedList.filter(eachItem =>
      eachItem.title.toLowerCase().includes(searchKey.toLowerCase()),
    )
    return newList
  }

  onSelectRadio = event => {
    if (event.target.checked === true) {
      this.setState({minPackage: event.target.id})
      this.fetchJobs()
    } else {
      this.setState({minPackage: ''})
      this.fetchJobs()
    }
  }

  onSelectCheckbox = event => {
    const {employeeType} = this.state
    if (event.target.checked === true) {
      if (employeeType === '') {
        this.setState({employeeType: event.target.id})
      } else {
        const empType = `${employeeType},${event.target.id}`
        this.setState({employeeType: empType})
      }
      this.fetchJobs()
    } else if (event.target.checked === false) {
      this.setState({
        employeeType: employeeType.replace(event.target.value, 'hi'),
      })
      this.fetchJobs()
    }
  }

  render() {
    const {
      searchKey,
      profApiStatus,
      jobsFetchedList,
      minPackage,
      employeeType,
    } = this.state
    console.log(minPackage, employeeType)
    const newList = searchKey === '' ? jobsFetchedList : this.onSearchStart()
    return (
      <div>
        <Header />
        <div className="jbg1">
          <div className="jbg11">
            <div className="profCon">{this.renderProfile()}</div>
            <hr />
            <div className="EmpCont">
              <h1 className="h1">Type of Employment</h1>
              <ul className="givenList">
                {employmentTypesList.map(eachItem => (
                  <li key={eachItem.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={eachItem.employmentTypeId}
                      className="cb"
                      onChange={this.onSelectCheckbox}
                    />
                    <label htmlFor={eachItem.employmentTypeId} className="p1">
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="EmpCont">
              <h1 className="h1">Salary Range</h1>
              <ul>
                {salaryRangesList.map(eachItem => (
                  <li className="givenList" key={eachItem.salaryRangeId}>
                    <input
                      type="radio"
                      id={eachItem.salaryRangeId}
                      className="cb"
                      name="radio1"
                      onChange={this.onSelectRadio}
                    />
                    <label htmlFor={eachItem.salaryRangeId} className="p1">
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jbg12">
            <div className="SCont">
              <input
                type="search"
                placeholder="Search"
                className="search"
                onChange={this.searchChange}
              />
              <button
                type="button"
                data-testid="searchButton"
                id="btn"
                onClick={this.onSearchStart}
              >
                <BsSearch className="search-icon search1" />
              </button>
            </div>
            {this.renderJobs(newList)}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
