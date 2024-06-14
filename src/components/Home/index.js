import {Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const Home = () => {
  const onClickFindJobs = () => {}

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-container-details">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs,salary,information,company
            reviews.Find the job taht fits your abilities and potential
          </p>
          <Link to="/jobs">
            <button
              onClick={onClickFindJobs}
              type="button"
              className="home-button"
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
