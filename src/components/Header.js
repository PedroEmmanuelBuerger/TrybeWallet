import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../style/header.css';

class Header extends Component {
  render() {
    const { email } = this.props;
    return (
      <header className="header">
        <h2 data-testid="email-field">{ email }</h2>
        <h4 data-testid="total-field">{ 0 }</h4>
        <h4 data-testid="header-currency-field">BRL</h4>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user.email,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Header);
