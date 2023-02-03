import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AddexpenseApi } from '../redux/actions';

class WalletForm extends Component {
  state = {
    index: 0,
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState(() => ({
      [name]: value,
    }));
  };

  saveExpense = () => {
    const { dispatch } = this.props;
    const { value, description, currency, method, tag, index } = this.state;
    this.setState(() => ({
      index: index + 1,
    }));
    const expenseObj = {
      id: index,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates: {},
    };
    this.setState(() => ({
      value: '',
      description: '',
    }));
    dispatch(AddexpenseApi(expenseObj));
  };

  editExpense = () => {
    const { idToEdit, dispatch } = this.props;
    const { value, description, currency, method, tag } = this.state;
    const expenseObj = {
      id: idToEdit,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates: {},
    };
    this.setState(() => ({
      value: '',
      description: '',
    }));
    dispatch(AddexpenseApi(expenseObj));
  };

  render() {
    const { value, description } = this.state;
    const { currencies, editor } = this.props;
    return (
      <form>
        <label htmlFor="value">
          Valor:
          <input
            type="number"
            name="value"
            id="value"
            data-testid="value-input"
            onChange={ this.handleChange }
            value={ value }
          />
        </label>
        <label htmlFor="description">
          Descrição:
          <input
            type="text"
            name="description"
            id="description"
            data-testid="description-input"
            onChange={ this.handleChange }
            value={ description }
          />
        </label>
        <label htmlFor="currency">
          Moeda:
          <select
            name="currency"
            id="currency"
            data-testid="currency-input"
            onChange={ this.handleChange }
          >
            {currencies.map((currency, index) => (
              <option key={ index }>
                {currency}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="method">
          Método de pagamento:
          <select
            name="method"
            id="method"
            data-testid="method-input"
            onChange={ this.handleChange }
          >
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de crédito">Cartão de crédito</option>
            <option value="Cartão de débito">Cartão de débito</option>
          </select>
        </label>
        <label htmlFor="tag">
          Tag:
          <select
            name="tag"
            id="tag"
            data-testid="tag-input"
            onChange={ this.handleChange }
          >
            <option value="Alimentação">Alimentação</option>
            <option value="Lazer">Lazer</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Transporte">Transporte</option>
            <option value="Saúde">Saúde</option>
          </select>
        </label>
        {editor ? (
          <button
            type="button"
            onClick={ this.editExpense }
          >
            Editar despesa
          </button>
        )
          : <button type="button" onClick={ this.saveExpense }>Adicionar despesa</button>}
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  editor: state.wallet.editor,
  idToEdit: state.wallet.idToEdit,
});

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  editor: PropTypes.bool.isRequired,
  idToEdit: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(WalletForm);
