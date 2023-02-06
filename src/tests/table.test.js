import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
import mockData from './helpers/mockData';
import App from '../App';

const email = 'sombraios@hotmail.com';
const currencies = Object.keys(mockData);
const initialEntries = ['/carteira'];
const State2 = {
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
    },
    {
      id: 1,
      value: '1',
      description: 'descrição',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Lazer',
      exchangeRates: mockData,
    },
    ] },
};
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

describe('testa as funcionalidades do table', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('verifica se a tabela está sendo renderizada', () => {
    renderWithRouterAndRedux(<Wallet />, { initialState, initialEntries });
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });
  it('verifica se a tabela está sendo renderizada com os valores esperados', () => {
    renderWithRouterAndRedux(<Wallet />, { initialState, initialEntries });
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    const tableColumns = screen.getAllByRole('columnheader');
    expect(tableColumns).toHaveLength(9);
    const columDescription = screen.getByRole('columnheader', { name: /descrição/i });
    const columTag = screen.getByRole('columnheader', { name: /tag/i });
    const columMethod = screen.getByRole('columnheader', { name: /método de pagamento/i });
    const columValorConvertido = screen.getByRole('columnheader', { name: /valor convertido/i });
    expect(columDescription).toBeInTheDocument();
    expect(columTag).toBeInTheDocument();
    expect(columMethod).toBeInTheDocument();
    expect(columValorConvertido).toBeInTheDocument();
    expect(columDescription).toHaveTextContent('Descrição');
    expect(columTag).toHaveTextContent('Tag');
    expect(columMethod).toHaveTextContent('Método de pagamento');
    expect(columValorConvertido).toHaveTextContent('Valor convertido');
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(2);
    const dolar = screen.getByRole('cell', { name: /dólar americano\/real brasileiro/i });
    const cellDescription = screen.getByRole('cell', { name: /descrição/i });
    const cellTag = screen.getByRole('cell', { name: /lazer/i });
    const cellMethod = screen.getByRole('cell', { name: /dinheiro/i });
    const value = screen.getByRole('cell', { name: /1.00/i });
    expect(dolar).toBeInTheDocument();
    expect(cellDescription).toBeInTheDocument();
    expect(cellTag).toBeInTheDocument();
    expect(cellMethod).toBeInTheDocument();
    expect(dolar).toHaveTextContent('Dólar Americano/Real Brasileiro');
    expect(cellDescription).toHaveTextContent('descrição');
    expect(cellTag).toHaveTextContent('Lazer');
    expect(cellMethod).toHaveTextContent('Dinheiro');
    expect(value).toHaveTextContent('1.00');
  });
  it('verifica se existe o botão de excluir e editar', async () => {
    renderWithRouterAndRedux(<Wallet />, { initialState, initialEntries });
    const deletebutton = screen.getByRole('button', { name: /excluir/i });
    const editbutton = screen.getByRole('button', { name: /editar/i });
    expect(deletebutton).toBeInTheDocument();
    expect(editbutton).toBeInTheDocument();
    expect(deletebutton).toHaveTextContent('Excluir');
    expect(editbutton).toHaveTextContent('Editar');
  });
  it('verifica se ao iniciar com mais valores todos são renderizados', () => {
    renderWithRouterAndRedux(<Wallet />, { initialState: { ...State2 }, initialEntries });
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(3);
  });
  it('verifica se ao excluir valores eles são removidos do table', () => {
    renderWithRouterAndRedux(<Wallet />, { initialState: { ...State2 }, initialEntries });
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    const deletebutton = screen.getAllByRole('button', { name: /excluir/i });
    expect(deletebutton).toHaveLength(2);
    userEvent.click(deletebutton[0]);
    const newrows = screen.getAllByRole('row');
    expect(newrows).toHaveLength(2);
  });
  it('verifica se é possivel editar valores', async () => {
    renderWithRouterAndRedux(<App />, { initialState, initialEntries });
    const editbutton = await screen.findByRole('button', { name: /editar/i });
    userEvent.click(editbutton);
    const descriptinput = screen.getByRole('textbox', { name: /descrição/i });
    const editbuttonsave = screen.getByRole('button', { name: /editar despesa/i });
    userEvent.type(descriptinput, 'editado');
    userEvent.click(editbuttonsave);
    const newdescript = await screen.findByRole('cell', { name: /editado/i });
    expect(newdescript).toBeInTheDocument();
  });
});
