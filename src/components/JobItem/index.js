import {Link} from 'react-router-dom'
import {BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import './index.css'

const JobItem = props => {
  const {jobItem} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobItem

  return (
    <li className="job-item-li">
      <Link className="link job-item-imag-con" to={`/jobs/${id}`}>
        <div className="job-item-imag-con-flex">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
          <h1 className="job-item-head">{packagePerAnnum}</h1>
        </div>
        <hr />
        <h1 className="job-item-head">Description</h1>
        <p className="job-item-para">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
