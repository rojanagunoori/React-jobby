import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import './index.css'
import Header from '../Header'

const apiStatusConstant = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    listItem: {
      jobDetails: {},
      similarJobs: [],
    },
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({apiStatus: apiStatusConstant.in_progress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        const updated = {
          jobDetails: {
            companyLogoUrl: data.job_details.company_logo_url,
            companyWebsiteUrl: data.job_details.company_website_url,
            employmentType: data.job_details.employment_type,
            id: data.job_details.id,
            jobDescription: data.job_details.job_description,
            location: data.job_details.location,
            packagePerAnnum: data.job_details.package_per_annum,
            rating: data.job_details.rating,
            title: data.job_details.title,
            lifeAtCompany: {
              description: data.job_details.life_at_company.description,
              imageUrl: data.job_details.life_at_company.image_url,
            },
            skills: data.job_details.skills.map(each => ({
              imageUrl: each.image_url,
              name: each.name,
            })),
          },
          similarJobs: data.similar_jobs.map(each => ({
            companyLogoUrl: each.company_logo_url,
            employmentType: each.employment_type,
            id: each.id,
            jobDescription: each.job_description,
            location: each.location,
            rating: each.rating,
            title: each.title,
          })),
        }

        this.setState({apiStatus: apiStatusConstant.success, listItem: updated})
      } else {
        this.setState({apiStatus: apiStatusConstant.failure})
      }
    } catch (error) {
      console.error('Error fetching job details:', error)
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  topDetails = () => {
    const {listItem} = this.state
    const {jobDetails} = listItem
    const {skills, lifeAtCompany} = jobDetails

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <li key={jobDetails.id} className="job-item-li">
        <div className="job-item-imag-con-flex">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="job-item-comapny-url"
          />
          <div>
            <h1 className="job-item-head">{title}</h1>
            <div className="job-item-flex">
              <FaStar className="icon star" />
              <p className="job-item-head">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-icon-flex">
          <div className="job-item-flex">
            <div className="job-item-flex">
              <MdLocationOn className="icon" />
              <p>{location}</p>
            </div>
            <div className="job-item-flex">
              <BsBriefcaseFill className="icon" />
              <p>{employmentType}</p>
            </div>
          </div>
          <p className="job-item-head">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="item-flex">
          <h1 className="job-item-head">Description</h1>
          <a href={companyWebsiteUrl}>Visit</a>
        </div>
        <p className="job-item-para">{jobDescription}</p>
        <h1 className="job-item-head">Skills</h1>
        <ul className="similar-ul">
          {skills.map(each => (
            <li className="skill-con" key={each.name}>
              <img src={each.imageUrl} alt={each.name} className="skill-logo" />
              <p>{each.name}</p>
            </li>
          ))}
        </ul>
        <h1 className="job-item-head">Life at Company</h1>
        <div className="item-flex">
          <p>{lifeAtCompany.description}</p>
          <img
            src={lifeAtCompany.imageUrl}
            alt="life at company"
            className="image"
          />
        </div>
      </li>
    )
  }

  jobsSuccess = () => {
    const {listItem} = this.state
    const {similarJobs} = listItem

    return (
      <div>
        <div>{this.topDetails()}</div>
        <h1 className="jobs-left-head">Similar Jobs</h1>
        <ul className="similar-ul">
          {similarJobs.map(each => (
            <li key={each.id} className="job-item-li similar-li">
              <div className="job-item-imag-con-flex">
                <img
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                  className="job-item-comapny-url"
                />
                <div>
                  <h1 className="job-item-head">{each.title}</h1>
                  <div className="job-item-flex">
                    <FaStar className="icon star" />
                    <p className="job-item-head">{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="job-item-icon-flex">
                <div className="job-item-flex">
                  <div className="job-item-flex">
                    <MdLocationOn className="icon" />
                    <p>{each.location}</p>
                  </div>
                  <div className="job-item-flex">
                    <BsBriefcaseFill className="icon" />
                    <p>{each.employmentType}</p>
                  </div>
                </div>
              </div>
              <hr />
              <h1 className="job-item-head">Description</h1>
              <p className="job-item-para">{each.jobDescription}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onClickJobsRetry = () => {
    this.getProducts()
  }

  jobsFailure = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        onClick={this.onClickJobsRetry}
        className="header-button"
      >
        Retry
      </button>
    </div>
  )

  renderLoading = () => (
    <div className="loader" data-testid="loader">
      <Loader width={80} height={80} color="#4f46e5" type="ThreeDots" />
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
        return this.jobsFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="con12">
        <Header />
        <main className="con12">
          <h1 className="main-heading">Similar Jobs</h1>
          <div className="item-details">{this.renderDetailsApiStatus()}</div>
        </main>
      </div>
    )
  }
}

export default JobItemDetails
