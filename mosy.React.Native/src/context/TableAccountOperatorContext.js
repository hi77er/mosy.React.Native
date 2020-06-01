import { AsyncStorage } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { tableAccountsService } from '../services/tableAccountsService';
import { venueTablesService } from '../services/venueTablesService';

const tableAccountOperatorReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'loadTableAccounts':
      result = { ...state, operatedTableAccounts: action.payload, };
      break;
    case 'loadOrders':
      result = { ...state, tableAccountOrders: action.payload, };
      break;
    case 'loadUnocupiedTables':
      result = { ...state, unoccupiedTables: action.payload, };
      break;
  }

  return result;
};

const loadTableAccounts = (dispatch) => {
  return async (venueId) => {
    const result = await tableAccountsService.loadTableAccounts(venueId);
    dispatch({ type: 'loadTableAccounts', payload: result });
  };
};

const loadOrders = (dispatch) => {
  return async (tableAccountId) => {
    const result = await tableAccountsService.loadOrders(tableAccountId);
    dispatch({ type: 'loadOrders', payload: result });
  };
};

const loadUnocupiedTables = (dispatch) => {
  return async (venueId) => {
    const result = await venueTablesService.loadUntakenTables(venueId);
    dispatch({ type: 'loadUnocupiedTables', payload: result });
  };
};


export const { Provider, Context } = createDataContext(
  tableAccountOperatorReducer,
  {
    loadTableAccounts,
    loadOrders,
    loadUnocupiedTables,
  },
  {
    operatedTableAccounts: null,
    tableAccountOrders: null,
  },
);
