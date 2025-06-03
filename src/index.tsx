import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { Provider } from 'react-redux';
const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);
import store from './services/store';

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
