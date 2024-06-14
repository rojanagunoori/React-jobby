import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import './index.css'
import Header from '../Header'
import JobItem from '../JobItem'

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

const locationData = [
  {
    id: 1,
    location: 'Hyderabad',
  },
  {
    id: 2,
    location: 'Bangalore',
  },
  {
    id: 3,
    location: 'Chennai',
  },
  {
    id: 4,
    location: 'Delhi',
  },
  {
    id: 5,
    location: 'Mumbai',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const apiStatusConstant1 = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileList: [],
    jobList: [],
    apiStatus: apiStatusConstant1.initial,
    apiStatus1: apiStatusConstant1.initial,
    employeType: [],
    packageVal: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobProfile()
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.in_progress})
    const {employeType, packageVal, searchInput} = this.state
    console.log(employeType.join(), packageVal)

    const url = `https://apis.ccbp.in/jobs?employment_type=${employeType.join(
      ',',
    )}&minimum_package=${packageVal}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const updatedDetails = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobList: updatedDetails,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  jobsSuccess = () => {
    const {jobList} = this.state
    return (
      <ul>
        {jobList.length === 0
          ? this.jobsFailure()
          : jobList.map(each => <JobItem key={each.id} jobItem={each} />)}
      </ul>
    )
  }

  getJobProfile = async () => {
    this.setState({apiStatus1: apiStatusConstant1.in_progress})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileList: updatedProfile,
        apiStatus1: apiStatusConstant1.success,
      })
    } else {
      this.setState({apiStatus1: apiStatusConstant1.failure})
    }
  }

  onClickJobsRetry = () => {
    this.getJobDetails()
  }

  jobsFailure = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="job-failure-img"
      />
      <h1>No Jobs Found</h1>
      <p>we could not find any jobs Try Other filters</p>
    </div>
  )

  jobsUnSuccessFailure = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        onClick={this.onClickJobsRetry}
        className="header-button"
      >
        Retry
      </button>
    </div>
  )

  renderDetailsApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.in_progress:
        return this.renderLoading()
      case apiStatusConstant.success:
        return this.jobsSuccess()
      case apiStatusConstant.failure:
        return this.jobsUnSuccessFailure()
      default:
        return null
    }
  }

  profileSuccess = () => {
    const {profileList} = this.state
    const {name, profileImageUrl, shortBio} = profileList

    return (
      <ul className="profile-sucess-container">
        <li key={profileList.name}>
          <img
            src={profileImageUrl}
            alt="profile"
            className="profile-success-img"
          />
          <h1 className="profile-success-head">{name}</h1>
          <p className="profile-success-para">{shortBio}</p>
        </li>
      </ul>
    )
  }

  onClickProfileRetry = () => {
    this.getJobProfile()
  }

  profileFailure = () => (
    <button
      type="button"
      onClick={this.onClickProfileRetry}
      className="header-button"
    >
      Retry
    </button>
  )

  renderLoading = () => (
    <div className="loader" data-testid="loader">
      <Loader width={80} height={80} color="#4f46e5" type="ThreeDots" />
    </div>
  )

  renderProfileApiStatus = () => {
    const {apiStatus1} = this.state

    switch (apiStatus1) {
      case apiStatusConstant1.in_progress:
        return this.renderLoading()
      case apiStatusConstant1.success:
        return this.profileSuccess()
      case apiStatusConstant1.failure:
        return this.profileFailure()
      default:
        return null
    }
  }

  onChangeSearch = e => {
    this.setState({searchInput: e.target.value})
  }

  onKeyDownSearch = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  onClickSearch = () => {
    this.getJobDetails()
  }

  onChangeSalaryRange = e => {
    console.log(e.target.value)
    this.setState({packageVal: e.target.value}, this.getJobDetails)
  }

  onChangeEmploymentType = e => {
    const {employeType} = this.state
    const value1 = e.target.value
    let updatedEmployeType

    if (e.target.checked) {
      updatedEmployeType = [...employeType, value1]
    } else {
      updatedEmployeType = employeType.filter(type => type !== value1)
    }

    this.setState({employeType: updatedEmployeType}, this.getJobDetails)
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-left-container">
            {this.renderProfileApiStatus()}
            <hr />
            <h1 className="jobs-left-head">Types of Employment</h1>
            <ul>
              {employmentTypesList.map(each => (
                <li
                  onChange={this.onChangeEmploymentType}
                  key={each.employmentTypeId}
                >
                  <input
                    value={each.employmentTypeId}
                    type="checkbox"
                    id={each.employmentTypeId}
                    className="input"
                  />
                  <label htmlFor={each.employmentTypeId} className="label">
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="jobs-left-head">Salary Range</h1>
            <ul>
              {salaryRangesList.map(each => (
                <li
                  onChange={this.onChangeSalaryRange}
                  key={each.salaryRangeId}
                >
                  <input
                    name="salary"
                    value={each.salaryRangeId}
                    type="radio"
                    id={each.salaryRangeId}
                    className="input"
                  />
                  <label htmlFor={each.salaryRangeId} className="label">
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="job-right-container">
            <div className="search-flex">
              <input
                placeholder="Search"
                className="search"
                type="search"
                onChange={this.onChangeSearch}
                value={searchInput}
              />
              <button
                aria-label="searchButton"
                onKeyDown={this.onKeyDownSearch}
                onClick={this.onClickSearch}
                data-testid="searchButton"
                type="button"
                className="search-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderDetailsApiStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
