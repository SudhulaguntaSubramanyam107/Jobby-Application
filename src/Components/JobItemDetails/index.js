import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    apiDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jobDetailsUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobDetailsUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const jobDetails = data.job_details
      this.setState({
        apiStatus: apiStatusConstants.success,
        apiDetails: jobDetails,
        similarJobs: data.similar_jobs,
      })
    }
    if (response.status === 400) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobs = () => {
    const {apiDetails, jobDetails, similarJobs} = this.state
    const jobItem = apiDetails
    console.log(apiDetails)
    return (
      <div className="jobDetCont">
        <div className="jobItem">
          <div>
            <div className="jbI1">
              <img
                src={jobItem.company_logo_url}
                alt="job details company logo"
                className="jobItemLogo1"
              />
              <div>
                <h1 className="h11">{jobItem.title}</h1>
                <p>{jobItem.rating}</p>
              </div>
            </div>
            <div className="fib">
              <div className="loc1">
                <div className="loc">
                  <img src="" alt="" />
                  <p>{jobItem.location}</p>
                </div>
                <div className="loc">
                  <img src="" alt="" />
                  <p>{jobItem.employment_type}</p>
                </div>
              </div>
              <p>{jobItem.package_per_annum}</p>
            </div>
          </div>
          <hr />
          <div>
            <div className="visitCont">
              <h1>Description</h1>
              <a href={jobItem.company_website_url}>Visit</a>
            </div>
            <p>{jobItem.job_description}</p>
          </div>
          <h1>Skills</h1>
          <ul className="skillList">
            {jobItem.skills.map(eachItem => (
              <div className="skillItem">
                <img
                  src={eachItem.image_url}
                  alt={eachItem.name}
                  className="skillLogo"
                />
                <p>{eachItem.name}</p>
              </div>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="lifeAtCont">
            <p>{jobItem.life_at_company.description}</p>
            <img
              src={jobItem.life_at_company.image_url}
              alt="life at company"
              className="lifeAtLogo"
            />
          </div>
        </div>
        <div>
          <h1 className="jdMainSimilar">Similar Jobs</h1>
          <ul className="jdList">
            {similarJobs.map(item => (
              <li className="jdItem" key={item.id}>
                <div className="jdLogoCont">
                  <img
                    src={item.company_logo_url}
                    alt="similar job company logo"
                    className="logo1"
                  />
                  <div className="jdProfCont">
                    <h1 className="jdHead">{item.title}</h1>
                    <div className="jdProfCont1">
                      <img src="" alt="" />
                      <p>{item.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="h11">Description</h1>
                <p>{item.job_description}</p>
                <div className="jdBottom">
                  <div>
                    <img src="" alt="" />
                    <p>{item.location}</p>
                  </div>
                  <div>
                    <img src="" alt="" />
                    <p>{item.employment_type}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  retryJobDetails = () => {
    this.fetchJobDetails()
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
      <button className="btn2" type="button" onClick={this.retryJobDetails}>
        Retry
      </button>
    </div>
  )

  renderDetails = () => {
    const {apiStatus, jobDetails} = this.state
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderJobs()
      default:
        return null
    }
  }

  render() {
    console.log(this.props)
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    return (
      <div className="detCont">
        <Header />
        <div>{this.renderDetails()}</div>
      </div>
    )
  }
}
export default JobItemDetails
