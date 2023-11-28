import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaExternalLinkAlt} from 'react-icons/fa'

import Header from '../Header'

import './index.css'

const linkWebsite = <FaExternalLinkAlt color="#6366f1" size={8} />

const statusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: '',
    skills: [],
    similarJobsList: [],
    apiStatus: statusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: statusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobDetailsData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const updatedSkillsData = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const updatedSimilarJobsData = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDetails: updatedJobDetailsData,
        skills: updatedSkillsData,
        similarJobsList: updatedSimilarJobsData,
        apiStatus: statusConstants.success,
      })
    } else {
      this.setState({apiStatus: statusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="job-item-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSimilarView = () => {
    const {similarJobsList} = this.state

    return (
      <div className="similar-container">
        <h1 className="similar-heading">Similar Jobs</h1>

        <ul className="similar-list-container">
          {similarJobsList.map(each => (
            <li key={each.id} className="similar-list-item-card">
              <div className="job-item-img-card">
                <img
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                  className="job-item-logo"
                />
                <div>
                  <h1 className="job-item-title">{each.title}</h1>
                  <div className="job-item-star-card">
                    <BsStarFill color="#fbbf24" size={14} />
                    <p className="job-item-rating">{each.rating}</p>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="description-name">Description</h1>
                <p className="job-description">{each.jobDescription}</p>
              </div>

              <div className="job-icon-card">
                <MdLocationOn className="job-icons" />
                <p className="job-location-text">{each.location}</p>
                <BsBriefcaseFill className="icons" />
                <p className="job-location-text">{each.employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetailsView = () => {
    const {jobDetails, skills} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      description,
      imageUrl,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div>
        <div className="job-item-card">
          <div className="job-item-img-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-item-logo"
            />
            <div>
              <h1 className="job-item-title">{title}</h1>
              <div className="job-item-star-card">
                <BsStarFill color="#fbbf24" size={14} />
                <p className="job-item-rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="job-item-location-card">
            <div className="job-icon-card">
              <MdLocationOn className="job-icons" />
              <p className="job-location-text">{location}</p>
              <BsBriefcaseFill className="icons" />
              <p className="job-location-text">{employmentType}</p>
            </div>

            <p className="job-per-annum">{packagePerAnnum}</p>
          </div>

          <hr className="job-line" />
          <div className="job-description-name-card">
            <h1 className="description-name">Description</h1>
            <a href={companyWebsiteUrl} className="visit-link">
              Visit {linkWebsite}
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>

          <h1 className="skills-title">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(each => (
              <li key={each.name} className="skills-list-item-card">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skills-img"
                />
                <h1 className="skills-name">{each.name}</h1>
              </li>
            ))}
          </ul>

          <div>
            <h1 className="life-head">Life at Company</h1>
            <div className="life-container">
              <p className="life-description">{description}</p>
              <img src={imageUrl} alt="life at company" className="life-img" />
            </div>
          </div>
        </div>

        {this.renderSimilarView()}
      </div>
    )
  }

  renderButtonView = () => (
    <div className="job-failure-container">
      <Header />
      <div className="job-failure-card">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="job-failure-img"
        />
        <h1 className="job-failure-heading">Oops! Something Went Wrong</h1>
        <p className="job-failure-para">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          type="button"
          className="retry-button"
          onClick={this.getJobDetails}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderSuccessView = () => (
    <div className="job-item-details-container">
      <Header />
      {this.renderJobDetailsView()}
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case statusConstants.success:
        return this.renderSuccessView()
      case statusConstants.failure:
        return this.renderButtonView()
      case statusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}

export default JobItemDetails
