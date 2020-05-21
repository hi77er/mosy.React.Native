import { AsyncStorage } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { tableAccountsService } from '../services/tableAccountsService';

const tableAccountsReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'loadTableAccounts':
      result = { ...state, operatedTableAccounts: action.payload, };
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


export const { Provider, Context } = createDataContext(
  tableAccountsReducer,
  {
    loadTableAccounts,
  },
  {
    operatedTableAccounts: null,
  },
);
