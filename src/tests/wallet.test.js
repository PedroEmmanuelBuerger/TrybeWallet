import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
import mockData from './helpers/mockData';

const email = 'sombraios@hotmail.com';

const currencies = Object.keys(mockData);

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

describe('teste da pagina completa do wallet', () => {
  it('verifica se exsitem os inputs esperados', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const valueInput = screen.getByTestId('value-input');
    const descriptionInput = screen.getByTestId('description-input');
    const currencyInput = screen.getByTestId('currency-input');
    const methodInput = screen.getByTestId('method-input');
    const tagInput = screen.getByTestId('tag-input');
    expect(valueInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(currencyInput).toBeInTheDocument();
    expect(methodInput).toBeInTheDocument();
    expect(tagInput).toBeInTheDocument();
  });
  it('verifica se é renderizado o header', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
  it('verifica se é renderizado a table', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    const tableColumns = screen.getAllByRole('columnheader');
    expect(tableColumns).toHaveLength(9);
    const columDescription = screen.getByRole('columnheader', { name: /descrição/i });
    const columTag = screen.getByRole('columnheader', { name: /tag/i });
    const columMethod = screen.getByRole('columnheader', { name: /método de pagamento/i });
    const columValorConvertido = screen.getByRole('columnheader', { name: /valor convertido/i });
    const columMoedaDeConversao = screen.getByRole('columnheader', { name: /moeda de conversão/i });
    const columEditar = screen.getByRole('columnheader', { name: /editar/i });
    expect(columDescription).toBeInTheDocument();
    expect(columTag).toBeInTheDocument();
    expect(columMethod).toBeInTheDocument();
    expect(columValorConvertido).toBeInTheDocument();
    expect(columMoedaDeConversao).toBeInTheDocument();
    expect(columEditar).toBeInTheDocument();
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(2);
    const valuecell = screen.getByRole('cell', { name: /1/i });
    const descriptioncell = screen.getByRole('cell', { name: /descrição/i });
    const tagcell = screen.getByRole('cell', { name: /Lazer/i });
    const methodcell = screen.getByRole('cell', { name: /dinheiro/i });
    expect(valuecell).toBeInTheDocument();
    expect(descriptioncell).toBeInTheDocument();
    expect(tagcell).toBeInTheDocument();
    expect(methodcell).toBeInTheDocument();
  });
  it('verifica se é renderizado o formulario', () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries, initialState });
    const valueInput = screen.getByTestId('value-input');
    const descriptionInput = screen.getByTestId('description-input');
    const currencyInput = screen.getByTestId('currency-input');
    const methodInput = screen.getByTestId('method-input');
    const tagInput = screen.getByTestId('tag-input');
    expect(valueInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(currencyInput).toBeInTheDocument();
    expect(methodInput).toBeInTheDocument();
    expect(tagInput).toBeInTheDocument();
  });
});
