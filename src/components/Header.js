import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../style/header.css';

class Header extends Component {
  render() {
    const { email, expenses } = this.props;
    const total = expenses.map((obj) => {
      const { value, currency, exchangeRates } = obj;
      console.log(exchangeRates[currency].ask);
      const rate = exchangeRates[currency].ask;
      return value * rate;
    });
    const totalValue = total.reduce((acc, curr) => acc + curr, 0);
    return (
      <header className="header">
        <h2 data-testid="email-field">{ email }</h2>
        <h4 data-testid="total-field">{totalValue.toFixed(2)}</h4>
        <h4 data-testid="header-currency-field">BRL</h4>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user.email,
  expenses: state.wallet.expenses,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  expenses: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

export default connect(mapStateToProps)(Header);
