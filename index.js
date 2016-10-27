import React, {Component, PropTypes} from 'react';

/**
 * Prop Types Validation
 *
 * @type object
 */
const propTypes = {
  isRequired: PropTypes.bool,
  isNumeric: PropTypes.bool,
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
  isNumeric: false
};

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

  validate(e) {
    const {
      isRequired,
      isNumeric,
      minLength,
      maxLength,
      message
    } = this.props;

    if (isRequired) {
      if (e.target.value.length === 0) {
        return this.setState({
          dirty: true,
          errorMessage: message.isRequired
        });
      }
    }

    if (isNumeric) {
      if (isNaN(e.target.value)) {
        return this.setState({
          dirty: true,
          errorMessage: message.isNumeric
        });
      }
    }

    if (isNumeric === false) {
      if (!isNaN(e.target.value)) {
        return this.setState({
          dirty: true,
          errorMessage: message.isNumeric
        });
      }
    }

    if (minLength) {
      if (e.target.value.length < minLength) {
        return this.setState({
          dirty: true,
          errorMessage: message.minLength
        });
      }
    }

    if (maxLength) {
      if (e.target.value.length > maxLength) {
        return this.setState({
          dirty: true,
          errorMessage: message.maxLength
        });
      }
    }

    this.setState({
      errorMessage: false,
      dirty: false
    });
  }

  /**
   * Render this component
   *
   * @return  element
   */
  render() {
    const {errorMessage, dirty} = this.state;
    const {children} = this.props;

    return (
      <span>
        {React.Children.map(children, child => {
          if (child.type === 'input' ||
              child.type === 'textarea') {
            return React.cloneElement(child, {
              onChange: (dirty) ? e => {
                if (typeof child.props.onChange === 'function') {
                  child.props.onChange(e);
                }
                return this.validate(e);
              } : child.props.onChange,
              onBlur: this.validate
            });
          }

          return child;
        })}
        {errorMessage && this.renderErrorMessage(errorMessage)}
      </span>
    );
  }
}

export default ValidateField;

ValidateField.propTypes = propTypes;

ValidateField.defaultProps = defaultProps;