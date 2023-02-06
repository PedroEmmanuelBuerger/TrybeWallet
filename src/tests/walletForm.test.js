import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
import mockData from './helpers/mockData';

const email = 'sombraios@hotmail.com';
const methods = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
const currencies = Object.keys(mockData);
const tags = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
const valueinputstring = 'value-input';
const descriptioninputstring = 'description-input';
const currencyinputstring = 'currency-input';
const methodinputstring = 'method-input';
const taginputstring = 'tag-input';
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

describe('teste as funcionalidades de walletForm', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('verifica se os inputs estão sendo renderizados', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const valueInput = screen.getByTestId(valueinputstring);
    const descriptionInput = screen.getByTestId(descriptioninputstring);
    const currencyInput = screen.getByTestId(currencyinputstring);
    const methodInput = screen.getByTestId(methodinputstring);
    const tagInput = screen.getByTestId(taginputstring);
    expect(valueInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(currencyInput).toBeInTheDocument();
    expect(methodInput).toBeInTheDocument();
    expect(tagInput).toBeInTheDocument();
  });
  it('verifica se existe o botão de salvar despesas e se ele chama a API', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const mokiapi = jest.spyOn(global, 'fetch');
    expect(mokiapi).not.toHaveBeenCalled();
    const submitbutton = screen.getByRole('button', { name: /Adicionar despesa/i });
    expect(submitbutton).toBeInTheDocument();
    userEvent.click(submitbutton);
    expect(mokiapi).toHaveBeenCalled();
  });
  it('verifica se ao mudar os inputs os valores são rendirizados', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const valueInput = screen.getByTestId(valueinputstring);
    const descriptionInput = screen.getByTestId(descriptioninputstring);
    const currencyInput = screen.getByTestId(currencyinputstring);
    const methodInput = screen.getByTestId(methodinputstring);
    const tagInput = screen.getByTestId(taginputstring);
    userEvent.type(valueInput, '1');
    userEvent.type(descriptionInput, 'descrição');
    userEvent.selectOptions(currencyInput, 'USD');
    userEvent.selectOptions(methodInput, 'Dinheiro');
    userEvent.selectOptions(tagInput, 'Lazer');
    expect(valueInput).toHaveValue(1);
    expect(descriptionInput).toHaveValue('descrição');
    expect(currencyInput).toHaveValue('USD');
    expect(methodInput).toHaveValue('Dinheiro');
    expect(tagInput).toHaveValue('Lazer');
  });
  it('verifica se ao salvar os valores dos inputs de value e description são resetados', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const valueInput = screen.getByTestId(valueinputstring);
    const descriptionInput = screen.getByTestId(descriptioninputstring);
    userEvent.type(valueInput, '1');
    userEvent.type(descriptionInput, 'descrição');
    const submitbutton = screen.getByRole('button', { name: /Adicionar despesa/i });
    userEvent.click(submitbutton);
    expect(valueInput).toHaveTextContent('');
    expect(descriptionInput).toHaveTextContent('');
  });
  it('verifica se todos os campos dos selects existem', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const currencyInput = screen.getByTestId(currencyinputstring);
    const methodInput = screen.getByTestId(methodinputstring);
    const tagInput = screen.getByTestId(taginputstring);
    expect(currencyInput).toBeInTheDocument();
    expect(methodInput).toBeInTheDocument();
    expect(tagInput).toBeInTheDocument();
    for (let i = 0; i < currencies.length; i += 1) {
      userEvent.selectOptions(currencyInput, currencies[i]);
      expect(currencyInput).toHaveValue(currencies[i]);
    }
    for (let i = 0; i < methods.length; i += 1) {
      userEvent.selectOptions(methodInput, methods[i]);
      expect(methodInput).toHaveValue(methods[i]);
    }
    for (let i = 0; i < tags.length; i += 1) {
      userEvent.selectOptions(tagInput, tags[i]);
      expect(tagInput).toHaveValue(tags[i]);
    }
  });
  it('verifica se ao adicionar uma despesa ela é renderizada na tabela', async () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const valueinput = screen.getByTestId(valueinputstring);
    const descriptioninput = screen.getByTestId(descriptioninputstring);
    userEvent.type(valueinput, '10');
    userEvent.type(descriptioninput, 'teste');
    const addbutton = screen.getByRole('button', { name: /Adicionar despesa/i });
    userEvent.click(addbutton);
    const newvalue = await screen.findByText('10.00');
    const newdescription = await screen.findByText('teste');
    expect(newvalue).toBeInTheDocument();
    expect(newdescription).toBeInTheDocument();
  });
  it('verifica se USDT não é renderizado', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const currencyinput = screen.getByTestId(currencyinputstring);
    expect(currencyinput).not.toHaveValue('USDT');
  });
});
