import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import AppRouter from './components/Router';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <TonConnectUIProvider 
        manifestUrl="https://tigran-tonconnect.s3.eu-central-1.amazonaws.com/tonconnect-manifest.json"
        actionsConfiguration={{
          twaReturnUrl: 'https://t.me/Tema_cash_bot'
        }}
      >
        <AppRouter />
      </TonConnectUIProvider>
    </Provider>
  );
}

export default App;
    