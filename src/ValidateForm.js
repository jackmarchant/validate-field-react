import React, {Component, PropTypes} from 'react';
import ValidateField from './ValidateField';

/**
 * Prop Types Validation
 *
 * @type object
 */
const propTypes = {
  isValid: PropTypes.func
};

/**
 * Default Props
 *
 * @type  object
 */
const defaultProps = {
  formData: {},
};

class ValidateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: props.data,
      isValid: false
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.validateFields = this.recursiveValidateChildren(this.props.children);
  }

  /**
   * Handle a simple field change in any field in the form
   *
   * @param   {mixed}   value  The value entered or selected in a form field
   * @param   {string}  name   Key in the form data state object to change
   *
   * @return  {void}
   */
  handleFieldChange(value, name) {
    const formData = Object.assign(this.state.formData, {
      [name]: value
    });
    const errors = this.validateFields.filter(field => {
      const result = field.type.hasError(
        field.type.getValidationErrors(
          field.props,
          this.state.formData[field.props.name]
        )
      );

      return result;
    });

    let isValid = (errors.length === 0);
    if (this.props.isValid) {
      this.props.isValid(isValid, formData);
    }

    return this.setState({
      formData,
      isValid
    });
  }

  /**
   * Get ValidateFields from children
   *
   * @param   {array|node}  children  Nested elements
   *
   * @return  {array}
   */
  recursiveValidateChildren(children) {
    return React.Children.map(children, child => {
      if (React.isValidElement(child) && child.type === ValidateField) {
        return child;
      } else if (React.isValidElement(child)) {
        return this.recursiveValidateChildren(child.props.children);
      }
    });
  }

  /**
   * Clone all ValidateField components with extra props
   *
   * @param   {array|node}  children  Nested elements
   *
   * @return  {array}
   */
  recursiveCloneChildren(children) {
    return React.Children.map(children, child => {
      let childProps = {};
      if (!React.isValidElement(child)) {
        return child;
      }
      if (child.type === ValidateField) {
        childProps = {
          onChange: this.handleFieldChange
        };
      }
      childProps.children = this.recursiveCloneChildren(child.props.children);
      return React.cloneElement(child, childProps);
    });
  }

  render() {
    const children = this.recursiveCloneChildren(this.props.children);

    return (
      <span>{children}</span>
    );
  }
}

export default ValidateForm;

ValidateForm.propTypes = propTypes;

ValidateForm.defaultProps = defaultProps;