import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { auth } from '../../api/config'

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true })
      auth
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser)
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

  isFormValid = ({ email, password }) => email && password

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const { email, password, errors, loading } = this.state
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="orange" />
            Log In to DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
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

              <Button disabled={loading} className={loading ? 'loading' : ''} color="violet" fluid size="large">
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
            Don't have an account? <Link to="/register">Create a account</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
