import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { auth, database } from '../../api/config'
import md5 from 'md5'

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    userRef: database.ref('users')
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      auth
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser)
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved')
              })
              this.setState({ loading: false })
            })
            .catch(err => {
              console.log(err)
              this.setState({ errors: this.state.errors.concat(err), loading: false })
            })
        })
        .catch(err => {
          console.log(err)
          this.setState({ errors: this.state.errors.concat(err), loading: false })
        })
    }
  }

  handleInputError = (errors, input) => {
    return errors.some(error => error.message.toLowerCase().includes(input)) ? 'error' : ''
  }

  isFormValid = () => {
    let errors = []
    let error
    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password invalid' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else {
      // valid form
      return true
    }
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation < 6) {
      return false
    } else if (password !== passwordConfirmation) {
      return false
    } else {
      // valid password
      return true
    }
  }

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length
  }

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

  saveUser = createdUser => {
    return this.state.userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    })
  }

  render() {
    const { username, email, password, passwordConfirmation, errors, loading } = this.state
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text"
                value={username}
              ></Form.Input>

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputError(errors, 'email')}
              ></Form.Input>

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputError(errors, 'password')}
              ></Form.Input>

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                type="password"
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'password')}
              ></Form.Input>

              <Button disabled={loading} className={loading ? 'loading' : ''} color="orange" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            {' '}
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
