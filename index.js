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

/**
 * Component
 */
class ValidateInput extends Component {
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
    if (this.props.isRequired) {
      if (e.target.value.length === 0) {
        return this.setState({
          dirty: true,
          errorMessage: this.props.message.isRequired
        });
      }
    }

    if (this.props.isNumeric) {
      if (isNaN(e.target.value)) {
        return this.setState({
          dirty: true,
          errorMessage: this.props.message.isNumeric
        });
      }
    }

    if (this.props.isNumeric === false) {
      if (!isNaN(e.target.value)) {
        return this.setState({
          dirty: true,
          errorMessage: this.props.message.isNumeric
        });
      }
    }

    if (this.props.minLength) {
      if (e.target.value.length < this.props.minLength) {
        return this.setState({
          dirty: true,
          errorMessage: this.props.message.minLength
        });
      }
    }

    if (this.props.maxLength) {
      if (e.target.value.length > this.props.maxLength) {
        return this.setState({
          dirty: true,
          errorMessage: this.props.message.maxLength
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

    return (
      <span>
        {React.Children.map(this.props.children, child => {
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

export default ValidateInput;

ValidateInput.propTypes = propTypes;

ValidateInput.defaultProps = defaultProps;