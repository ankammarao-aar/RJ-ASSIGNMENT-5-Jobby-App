import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Profile from '../Profile'
import Header from '../Header'
import JobsCard from '../JobsCard'

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

const statusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const searchIcon = <BsSearch color="#f8fafc" />

class Jobs extends Component {
  state = {
    searchInput: '',
    checkBoxInput: [],
    radioInput: '',
    jobsList: [],
    apiStatus: statusConstants.initial,
  }

  componentDidMount() {
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({apiStatus: statusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const {searchInput, checkBoxInput, radioInput} = this.state
    const stringSeparated = checkBoxInput.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${stringSeparated}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        isResponse: true,
        apiStatus: statusConstants.success,
      })
    } else {
      this.setState({apiStatus: statusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="job-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderButtonView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="job-failure-heading">Oops! Something Went Wrong</h1>
      <p className="job-failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobsDetails}
      >
        Retry
      </button>
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchInput = () => {
    this.getJobsDetails()
  }

  renderSearchBar = () => {
    const {searchInput} = this.state

    return (
      <>
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          value={searchInput}
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.onClickSearchInput}
        >
          {searchIcon}
        </button>
      </>
    )
  }

  onChangeCheckBox = event => {
    const {checkBoxInput} = this.state
    const filterCheckInput = checkBoxInput.filter(
      each => each === event.target.id,
    )
    if (filterCheckInput.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInput: [...prevState.checkBoxInput, event.target.id],
        }),
        this.getJobsDetails,
      )
    } else {
      const filteredCheckInput = checkBoxInput.filter(
        each => each !== event.target.id,
      )
      this.setState({checkBoxInput: filteredCheckInput}, this.getJobsDetails)
    }
  }

  renderEmploymentOptionsView = () => (
    <div>
      <h1 className="employment-heading">Type of Employment</h1>
      <ul className="employment-list-container">
        {employmentTypesList.map(eachBox => (
          <li key={eachBox.employmentTypeId} className="employment-list-item">
            <input
              type="checkbox"
              id={eachBox.employmentTypeId}
              className="input-box"
              onChange={this.onChangeCheckBox}
            />
            <label
              htmlFor={eachBox.employmentTypeId}
              className="employment-name"
            >
              {eachBox.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onChangeRadio = event => {
    this.setState({radioInput: event.target.id}, this.getJobsDetails)
  }

  renderSalaryOptionsView = () => (
    <div>
      <h1 className="employment-heading">Salary Range</h1>
      <ul className="employment-list-container">
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId} className="employment-list-item">
            <input
              type="radio"
              id={each.salaryRangeId}
              name="option"
              className="input-box"
              onChange={this.onChangeRadio}
            />
            <label htmlFor={each.salaryRangeId} className="employment-name">
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderJobsCardView = () => {
    const {jobsList, isResponse} = this.state
    if (isResponse) {
      const noJobs = jobsList.length === 0
      return noJobs ? (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1 className="no-jobs-head">No Jobs found</h1>
          <p className="no-jobs-para">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      ) : (
        <ul className="jobs-card-list-container">
          {jobsList.map(each => (
            <JobsCard key={each.id} jobsDetails={each} />
          ))}
        </ul>
      )
    }
    return null
  }

  renderApiView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case statusConstants.success:
        return this.renderJobsCardView()
      case statusConstants.failure:
        return this.renderButtonView()
      case statusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-container">
        <Header />

        <div className="mobile-jobs-card">
          <div className="search-card">{this.renderSearchBar()}</div>

          <div className="profile-container">
            <Profile />
            <hr className="line" />

            {this.renderEmploymentOptionsView()}
            <hr className="line" />
            {this.renderSalaryOptionsView()}
          </div>

          <div className="jobs-card-container">{this.renderApiView()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
