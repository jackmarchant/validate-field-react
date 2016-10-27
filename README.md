# validate-field-react
A validation component library for React form components.

It will validate against the following:
- isNumeric (Boolean)
- isNotNumeric (Boolean)
- isRequired (Boolean)
- minLength (Integer)
- maxLength (Integer)

`npm install validate-field-react`

## Usage
```
import ValidateField from 'validate-field-react';
// Use my own custom feedback component, accepting a `message` prop
import FeedbackComponent from 'my/optional/FeedbackComponent';

<ValidateField
  isNotNumeric
  isRequired
  minLength={2}
  component={<FeedbackComponent type="error" />}
  message={{
    isNumeric: 'Your name should not be numeric',
    isRequired: 'Please enter your name',
    minLength: 'Please provide at least 2 characters for your name'
  }}
>
  <input
    className="text-input"
    type="text"
    id="name"
    onChange={e => this.handleFieldChange(e.target.value, 'name')}
    defaultValue={this.state.formData.name.value}
  />
</ValidateField>
```