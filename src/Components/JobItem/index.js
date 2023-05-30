import {Link} from 'react-router-dom'
import './index.css'

const JobItem = props => {
  const {jobItem} = props
  return (
    <li>
      <Link to={`/jobs/${jobItem.id}`} className="link">
        <div className="jobItem">
          <div>
            <div className="jbI1">
              <img
                src={jobItem.company_logo_url}
                alt="company logo"
                className="jobItemLogo"
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
              <h1>{jobItem.package_per_annum}</h1>
            </div>
          </div>
          <hr />
          <div>
            <h1>Description</h1>
            <p>{jobItem.job_description}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default JobItem
