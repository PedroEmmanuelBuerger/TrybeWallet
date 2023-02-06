import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import mockData from './helpers/mockData';

describe('teste da pagina de login e suas funcionalidades', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('testa se existem os inputs de email e senha ', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
  it('testa se existe o botao de login', () => {
    renderWithRouterAndRedux(<App />);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    expect(loginButton).toBeInTheDocument();
  });
  it('testa se o botão só habilita caso os campos estejam preenchidos', () => {
    renderWithRouterAndRedux(<App />);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    expect(loginButton).toBeDisabled();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    userEvent.type(emailInput, 'teste');
    expect(emailInput).toHaveValue('teste');
    userEvent.type(passwordInput, 'teste');
    expect(loginButton).toBeDisabled();
    userEvent.clear(emailInput);
    userEvent.clear(passwordInput);
    userEvent.type(emailInput, 'pedro@hotmail.com');
    expect(emailInput).toHaveValue('pedro@hotmail.com');
    userEvent.type(passwordInput, '12345');
    expect(loginButton).toBeDisabled();
    userEvent.type(passwordInput, '123456');
    expect(loginButton).toBeEnabled();
  });
  it('verifica se a pagina é rediceriona a /carteira caso o botão seja clicado', () => {
    const email = 'joao@hotmail.com';
    const password = '123456';
    const { history } = renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    userEvent.type(emailInput, email);
    userEvent.type(passwordInput, password);
    userEvent.click(loginButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');
    const emailHeader = screen.getByText(email);
    expect(emailHeader).toBeInTheDocument();
  });
  it('verifica se a api é chamada ao clicar no botão', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    userEvent.type(emailInput, 'teste@hotmail.com');
    userEvent.type(passwordInput, '123456');
    act(() => {
      userEvent.click(loginButton);
    });
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/all');
  });
  it('verifica se ao entrar na rota /carteira sem logar o nome do usuário não aparece e a api n é chamada', () => {
    const apiMock = jest.spyOn(global, 'fetch');
    const { history } = renderWithRouterAndRedux(<App />);
    const email = 'sombraios@hotmai.com';
    const inputemail = screen.getByLabelText(/email/i);
    userEvent.type(inputemail, email);
    history.push('/carteira');
    const emailHeader = screen.queryByText(email);
    expect(emailHeader).not.toBeInTheDocument();
    expect(apiMock).not.toHaveBeenCalled();
  });
  it('verifica se o nome do usuário aparece na rota /carteira conforme o estado global', () => {
    const initialState = {
      user: {
        email: 'sombraios@hotmail.com',
      },
    };
    const email = 'sombraios@hotmail.com';
    const { history } = renderWithRouterAndRedux(<App />, { initialState });
    act(() => {
      history.push('/carteira');
    });
    const emailHeader = screen.getByText(email);
    expect(emailHeader).toBeInTheDocument();
  });
});
