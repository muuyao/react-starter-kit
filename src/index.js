import 'isomorphic-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import thunkMiddleware from 'redux-thunk';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';

import api from './middleware/api';

import rootRoute from './routes/';
import * as reducers from './reducers';

import './assets/styles/reset.css';

let history = useRouterHistory(createHistory)(/*{basename: '/huzhu'}*/);

const router = routerMiddleware(history);

const middlewares = [router, thunkMiddleware, api];

// 非研发环境引入 logger
if (__MODE__ === 'dev') {
  const vConsole = require('vconsole');
  const createLogger = require('redux-logger');
  const logger = createLogger();
  middlewares.push(logger);
}

const store = createStore(combineReducers({
  ...reducers,
  routing: routerReducer
}), applyMiddleware(...middlewares));

history = syncHistoryWithStore(history, store);

render((
  <Provider store={store}>
    <Router history={history} routes={rootRoute} />
  </Provider>
), document.getElementById('app'));
