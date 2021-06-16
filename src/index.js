import React, { Component } from 'react'
// stylesheet
import 'semantic-ui-css/semantic.min.css'
import Spinner from './components/Spinner/index'

// pages
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

// routes
import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'

// firebase
import { auth } from './api/config'

// extension for chrome to interact & redux
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { setUser, clearUser } from './actions/'

const store = createStore(rootReducer, composeWithDevTools())
class Root extends Component {
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user)
        this.props.history.push('/')
      } else {
        this.props.history.push('/login')
        this.props.clearUser()
      }
    })
  }
  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
})

// handles state auth
const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root))

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
