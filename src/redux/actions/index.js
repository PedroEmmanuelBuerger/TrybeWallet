// Coloque aqui suas actions
export const actionUser = (user) => ({
  type: 'USER',
  user,
});

export const actionWallet = (currencies) => ({
  type: 'currencies',
  currencies,
});

export function actionWalletApi() {
  const api = 'https://economia.awesomeapi.com.br/json/all';
  return (dispatch) => fetch(api)
    .then((response) => response.json())
    .then((prices) => dispatch(actionWallet({ currencies:
       Object.keys(prices).filter((currency) => currency !== 'USDT') })));
}

const Addexpense = (expenses) => ({
  type: 'ADD_EXPENSE',
  expenses,
});

export function AddexpenseApi(obj) {
  const api = 'https://economia.awesomeapi.com.br/json/all';
  return (dispatch) => fetch(api)
    .then((response) => response.json())
    .then((prices) => dispatch(Addexpense([{ ...obj,
      exchangeRates: prices }])));
}

export const deleteExpense = (id) => ({
  type: 'DELETE_EXPENSE',
  id: Number(id),
});
