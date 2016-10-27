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
  maxLength: PropTypes.number
};

/**
 * Default Props
 *
 * @type  object
 */
const defaultProps = {
  isRequired: false,
};

/**
 * Component
 */
class ValidateField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: false,
      dirty: false
    };
    this.validate = this.validate.bind(this);
  }

  renderErrorMessage(message) {
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
    const {
      message
    } = this.props;
    const {value} = e.target;
    const rules = extractValidaitonRules(this.props);
    const validationErrors =
      // check that the resulting value is equal to value provided in props
      rules.filter(rule => rule.func(value, rule.value) === rule.value)
      // filter out any rules that don't have a message
      .filter(rule => message[rule.name])
      .map(rule => message[rule.name]);

    // when there is at least one validation error, render the first one
    if (validationErrors.length > 0) {
      return this.setState({
        dirty: true,
        errorMessage: validationErrors[0]
      });
    }

    return this.setState({
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
            if (typeof child.props.onChange === 'function') {
              child.props.onChange(e);
            }
            return this.validate(e);
          } : child.props.onChange,
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