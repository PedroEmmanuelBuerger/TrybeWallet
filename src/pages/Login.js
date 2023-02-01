import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionUser } from '../redux/actions/index';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    buttonValidate: true,
  };

  validateAndSaveInfo = () => {
    const { email } = this.state;
    const { dispatch, history } = this.props;
    dispatch(actionUser({ email }));
    history.push('/carteira');
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState(() => ({
      [name]: value,
    }), this.validateButton);
  };

  validateButton = () => {
    const number = 6;
    const { email, password } = this.state;
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    const passwordvali = password.length >= number;
    const emailTest = emailRegex.test(email);
    if (emailTest && passwordvali) {
      this.setState({
        buttonValidate: false,
      });
    } else {
      this.setState({
        buttonValidate: true,
      });
    }
  };

  render() {
    const { buttonValidate } = this.state;
    return (
      <form>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            id="email"
            data-testid="email-input"
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="password">
          Senha:
          <input
            type="password"
            name="password"
            id="password"
            data-testid="password-input"
            onChange={ this.handleChange }
          />
        </label>
        <button
          type="button"
          onClick={ this.validateAndSaveInfo }
          disabled={ buttonValidate }
        >
          Entrar

        </button>
      </form>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(Login);
