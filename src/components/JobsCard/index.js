import {Link} from 'react-router-dom'

import {BsBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobsCard = props => {
  const {jobsDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobsDetails

  return (
    <Link to={`/jobs/${id}`} className="jobs-card-link">
      <li className="jobs-card-list-item">
        <div className="compony-img-card">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="jobs-card-logo"
          />
          <div>
            <h1 className="company-title">{title}</h1>
            <div className="star-card">
              <BsStarFill color="#fbbf24" size={10} />
              <p className="company-rating">{rating}</p>
            </div>
          </div>
        </div>

        <div className="company-location-card">
          <div className="icon-card">
            <MdLocationOn className="icons" />
            <p className="location-text">{location}</p>
            <BsBriefcaseFill className="icons" />
            <p className="location-text">{employmentType}</p>
          </div>

          <p className="per-annum">{packagePerAnnum}</p>
        </div>
        <hr className="jobs-line" />
        <h1 className="dis-name">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobsCard
