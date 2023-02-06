import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
import App from '../App';
import mockData from './helpers/mockData';

const email = 'sombraios@hotmail.com';
const password = '123456';

const currencies = Object.keys(mockData);

const totalField = 'total-field';
const initialEntries = ['/carteira'];
const initialState = {
  user: {
    email,
  },
  wallet: {
    currencies,
    expenses: [{
      id: 0,
      value: '1',
      description: 'descrição',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Lazer',
      exchangeRates: mockData,
    }],
    editor: false,
    idToEdit: 0,
  },
};

describe('teste as funcionalidades do header da pagina', () => {
  it('verifica se o header existe', () => {
    renderWithRouterAndRedux(<Wallet />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
  it('verifica se o header renderiza os valores corretamente', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    userEvent.type(emailInput, email);
    userEvent.type(passwordInput, password);
    userEvent.click(submitButton);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    const emailHeader = screen.getByTestId('email-field');
    expect(emailHeader).toBeInTheDocument();
    expect(emailHeader).toHaveTextContent(email);
    const totalHeader = screen.getByTestId(totalField);
    expect(totalHeader).toBeInTheDocument();
    expect(totalHeader).toHaveTextContent('0');
    const headerCurrencies = screen.getByTestId('header-currency-field');
    expect(headerCurrencies).toBeInTheDocument();
    expect(headerCurrencies).toHaveTextContent('BRL');
  });
  it('verifica se o botão de adicionar despesa existe', () => {
    renderWithRouterAndRedux(<Wallet />);
    const addExpenseButton = screen.getByRole('button', { name: /adicionar despesa/i });
    expect(addExpenseButton).toBeInTheDocument();
  });
  it('verifica se ao adicionar despesa os valores do header mudam conforme o esperado', () => {
    renderWithRouterAndRedux(<App />, { initialState, initialEntries });
    const totalHeader = screen.getByTestId(totalField);
    expect(totalHeader).toBeInTheDocument();
    expect(totalHeader).toHaveTextContent('4.75');
  });
  it('verifica se ao remover os valores do header ele muda o valor conforme esperado', () => {
    renderWithRouterAndRedux(<App />, { initialState, initialEntries });
    const totalHeader = screen.getByTestId(totalField);
    expect(totalHeader).toBeInTheDocument();
    expect(totalHeader).toHaveTextContent('4.75');
    const deleteButton = screen.getByRole('button', { name: /Excluir/i });
    userEvent.click(deleteButton);
    expect(totalHeader).toHaveTextContent('0');
  });
});
