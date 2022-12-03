import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

//  This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    searchCategory: categoriesList[0].id,
    api: apiStatus.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    const {searchCategory} = this.state
    this.setState({api: apiStatus.inProgress})

    const url = `https://apis.ccbp.in/ps/projects?category=${searchCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    // console.log(response)
    const data = await response.json()
    if (response.ok === true) {
      const updateList = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))

      this.setState({projectsList: updateList, api: apiStatus.success})
    } else {
      this.setState({api: apiStatus.failure})
    }
  }

  renderNavBar = () => (
    <nav className="nav">
      <img
        className="logo"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
        alt="website logo"
      />
    </nav>
  )

  update = event => {
    // setState is a asynchronous so it takes optional arguments
    //  we are calling api when option updated
    // here this.getDetails is a call back function and parameter to setState
    this.setState({searchCategory: event.target.value}, this.getDetails)
  }

  renderSuccess = () => {
    const {projectsList} = this.state
    return (
      <ul className="ul">
        {projectsList.map(each => (
          <li className="li" key={each.id}>
            <img className="im" src={each.imageUrl} alt={each.name} />
            <p>{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div
      // testid='loader'
      className="load"
    >
      <Loader type="ThreeDots" size={50} color="#328af2" />
    </div>
  )

  onRetry = () => {
    this.getDetails()
  }

  renderFailure = () => (
    <div className="fail-bg">
      <img
        className="fail"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.onRetry} className="retry" type="button">
        Retry
      </button>
    </div>
  )

  renderResult = () => {
    const {api} = this.state
    switch (api) {
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.failure:
        return this.renderFailure()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg">
        {this.renderNavBar()}
        <select onChange={this.update} className="select">
          {categoriesList.map(each => (
            <option value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderResult()}
      </div>
    )
  }
}

export default App
