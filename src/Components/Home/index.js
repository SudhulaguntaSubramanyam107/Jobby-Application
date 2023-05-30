import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const onChangeToJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <div className="home">
      <Header />
      <div>
        <div className="h2">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that your abilities and potential.
          </p>
          <Link to="/jobs" className="link">
            <button className="btn2" onClick={onChangeToJobs} type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Home
