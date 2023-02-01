// Coloque aqui suas actions
export const actionUser = (user) => ({
  type: 'USER',
  user,
});

export const actionWallet = (wallet) => ({
  type: 'WALLET',
  wallet,
});

export function actionWalletApi() {
  const api = 'https://economia.awesomeapi.com.br/json/all';
  return (dispatch) => fetch(api)
    .then((response) => response.json())
    .then((prices) => dispatch(actionWallet({ currencies:
       Object.keys(prices).filter((currency) => currency !== 'USDT') })));
}
