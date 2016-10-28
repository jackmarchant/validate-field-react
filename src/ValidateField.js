import React, {Component, PropTypes} from 'react';

/**
 * Extract Validation Rules from props.
 * When props are provided to the component a whitelist
 * of validation rules is used to extract the appropriate
 * keys from the props object. Each rule has a function, which
 * validates the input against any parameters and the value entered/selected
 * by the user.
 *
 * @param   {object}  props  Props from the component
 *
 * @return  {array}          An array of objects used internally
 */
const extractValidaitonRules = props => {
  const rulesWhitelist = [
    {
      name: 'isRequired',
      func: v => v.length === 0,
    },
    {
      name: 'isNumeric',
      func: v => isNaN(v)
    },
    {
      name: 'isNotNumeric',
      func: v => !isNaN(v)
    },
    {
      name: 'minLength',
      func: (v, l) => (v.length < l) ? l : false
    },
    {
      name: 'maxLength',
      func: (v, l) => (v.length > l) ? l : false
    },
    {
      name: 'isEmail',
      func: (v) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !emailRegex.test(v);
      }
    }
  ];

  return rulesWhitelist.filter(i => props[i.name]).map(rule => {
    return {
      name: rule.name,
      value: props[rule.name],
      func: rule.func
    }
  });
};

/**
 * Prop Types Validation
 *
 * @type object
 */
const propTypes = {
  isRequired: PropTypes.bool,
  isNumeric: PropTypes.bool,
  isNotNumeric: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  component: PropTypes.element,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired
};

/**
 * Default Props
 *
 * @type  object
 */
const defaultProps = {
  isRequired: false,
};

class ValidateField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: false, // message to show the user
      dirty: false // whether a field has been validated
    };
    this.validate = this.validate.bind(this);
  }

  /**
   * Render a validation error message
   *
   * @param   {string}  message  Validation message from props
   *
   * @return  {element}
   */
  renderErrorMessage(message) {
    const {component} = this.props;
    if (component) {
      return React.cloneElement(component, {
        message
      });
    }

    return <p className="error">{message}</p>;
  }

  /**
   * Validate the input or selection and set state with any validation errors.
   * See @cloneFieldsWithProps for usage
   *
   * @param   {object}  e  An event such as keydown
   *
   * @return  {void}
   */
  validate(e) {
    const validationErrors = ValidateField.getValidationErrors(this.props, e.target.value);

    // when there is at least one validation error, render the first one
    if (ValidateField.hasError(validationErrors)) {
      return this.setState({
        dirty: true,
        errorMessage: validationErrors[0]
      });
    }

    // revert back to initial state
    this.setState({
      errorMessage: false,
      dirty: false
    });
  }

  /**
   * Clone form fields with extra props to handle browser events
   *
   * @param   {node|array}  children  this.props.children
   * @param   {object}      state     A slice of the current state
   *
   * @return  {array}
   */
  cloneFieldsWithProps(children, state) {
    return React.Children.map(children, child => {
      if (child.type === 'input' ||
          child.type === 'textarea') {
        return React.cloneElement(child, {
          onChange: (state.dirty) ? e => {
            if (this.props.onChange) {
              this.props.onChange(e.target.value, this.props.name);
            }
            return this.validate(e);
          } : e => this.props.onChange(e.target.value, this.props.name),
          onBlur: this.validate
        });
      }

      return child;
    });
  }

  render() {
    const {errorMessage, dirty} = this.state;
    const clonedChildren = this.cloneFieldsWithProps(this.props.children, {dirty});

    return (
      <span>
        {clonedChildren}
        {errorMessage && this.renderErrorMessage(errorMessage)}
      </span>
    );
  }
}

export default ValidateField;

ValidateField.propTypes = propTypes;

ValidateField.defaultProps = defaultProps;

ValidateField.getValidationErrors = (props, value) => {
  const rules = extractValidaitonRules(props);
  // check that the resulting value is equal to value provided in props
  return rules.filter(rule => rule.func(value, rule.value) === rule.value)
    // filter out any rules that don't have a message
    .filter(rule => props.message[rule.name])
    .map(rule => props.message[rule.name]);
}

ValidateField.hasError = (errors) => {
  return errors.length > 0;
}
