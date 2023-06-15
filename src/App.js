import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectShowCase from './components/ProjectShowCase'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    projectsDataList: [],
    apiStatus: apiStatusConstants.initial,
    selectElement: 'ALL',
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {selectElement} = this.state

    const url = ` https://apis.ccbp.in/ps/projects?category=${selectElement}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsDataList: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOption = event => {
    this.setState({selectElement: event.target.value}, this.getProjectsData)
  }

  loadingView = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {projectsDataList} = this.state
    return (
      <div className="main-container">
        <ul className="projects-view-app-container">
          {projectsDataList.map(eachProject => (
            <ProjectShowCase
              projectDetails={eachProject}
              key={eachProject.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.getProjectsData}
      >
        Retry
      </button>
    </div>
  )

  renderProjectsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {selectElement} = this.state
    return (
      <div>
        <nav className="nav-header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="website-logo"
            alt="website logo"
          />
        </nav>
        <div className="projects-container">
          <ul className="select-container">
            <select
              className="select-item"
              value={selectElement}
              onChange={this.onChangeOption}
            >
              {categoriesList.map(eachOption => (
                <option value={eachOption.id} key={eachOption.id}>
                  {eachOption.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.renderProjectsView()}
        </div>
      </div>
    )
  }
}

export default App
