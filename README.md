# validate-field-react
A validation component library for React form components.

It will validate against the following:
- isNumeric (Boolean)
- isNotNumeric (Boolean)
- isRequired (Boolean)
- minLength (Integer)
- maxLength (Integer)
- isEmail (Boolean)

`npm install validate-field-react`

## Usage
```
import React, { Component } from 'react';
import {ValidateField, ValidateForm} from 'validate-field-react';
import './App.css';

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <p className="error feedback-custom">{this.props.type}: {this.props.message}</p>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      isValid: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    console.log(this.state);

    return false;
  }

  isValid(isValid, formData) {
    this.setState({
      formData,
      isValid
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Form Validation</h2>
        </div>
        <div className="App-content">
          <ValidateForm
            isValid={this.isValid}
            data={{
              name: '',
              email: '',
              age: '',
              comment: ''
            }}
          >
            <form>
              <div className="form-field">
                <label className="label" htmlFor="name">Name</label>
                <ValidateField
                  name="name"
                  isNotNumeric
                  isRequired
                  minLength={2}
                  message={{
                    isNotNumeric: 'Your name cannot be numeric',
                    isRequired: 'Please enter your name'
                  }}
                >
                  <input
                    className="text-input"
                    type="text"
                    id="name"
                  />
                </ValidateField>
              </div>
              <div className="form-field">
                <label className="label" htmlFor="email">Email</label>
                <ValidateField
                  name="email"
                  isEmail
                  isRequired
                  message={{
                    isEmail: 'Please enter a valid email address',
                    isRequired: 'Please enter your email'
                  }}
                >
                  <input
                    className="text-input"
                    type="email"
                    id="email"
                  />
                </ValidateField>
              </div>
              <div className="form-field">
                <label className="label" htmlFor="age">Age</label>
                <ValidateField
                  name="age"
                  isRequired
                  isNumeric
                  message={{
                    isRequired: 'Please enter your age',
                    isNumeric: 'Your age should be a number'
                  }}
                  component={<Feedback type="error" />}
                >
                  <input
                    className="text-input"
                    type="text"
                    id="age"
                  />
                </ValidateField>
              </div>
              <div className="form-field">
                <label className="label" htmlFor="comment">Comment</label>
                <ValidateField
                  name="comment"
                  isRequired
                  minLength={50}
                  maxLength={250}
                  message={{
                    isRequired: 'Please enter your comment',
                    minLength: 'Please provide at least 50 characters in your comment',
                    maxLength: 'Please keep your comments below 250 characters'
                  }}
                >
                  <textarea
                    className="text-input"
                    id="comment"
                  />
                </ValidateField>
              </div>
              <div className="form-field">
                <button
                  className="button"
                  type="submit"
                  disabled={(this.state.isValid) ? null : true}
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </ValidateForm>
        </div>
      </div>
    );
  }
}

export default App;

```