import { AsyncStorage } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { tableAccountsService } from '../services/tableAccountsService';
import { venueTablesService } from '../services/venueTablesService';

const tableAccountCustomerReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'setSelectedTable':
      result = { ...state, selectedTable: action.payload, };
      break;
    case 'setAssignedOperator':
      result = { ...state, assignedOperator: action.payload, };
      break;
    case 'placeNewOrder':
      result = { ...state, };
      break;
    case 'addNewOrderItem':
      result = { ...state, newlySelectedItems: [...state.newlySelectedItems, action.payload] };
      break;
    case 'removeNewOrderItem':
      result = {
        ...state,
        newlySelectedItems: state.newlySelectedItems.filter(x => x.id == action.payload).length
          ? state.newlySelectedItems.filter(x => x.id != action.payload)
          : state.newlySelectedItems
      };
      break;
  }

  return result;
};

const setSelectedTable = (dispatch) => {
  return async (selectedTable) => {
    dispatch({ type: 'setSelectedTable', payload: selectedTable });
  };
};

const setAssignedOperator = (dispatch) => {
  return async (operator) => {
    dispatch({ type: 'setAssignedOperator', payload: operator });
  };
};

const placeNewOrder = (dispatch) => {
  return async (operator) => {
    dispatch({ type: 'placeNewOrder' });
  };
};

const addNewOrderItem = (dispatch) => {
  return async (item) => {
    dispatch({ type: 'addNewOrderItem', payload: item });
  };
};

const removeNewOrderItem = (dispatch) => {
  return async (itemId) => {
    dispatch({ type: 'removeNewOrderItem', payload: itemId });
  };
};


export const { Provider, Context } = createDataContext(
  tableAccountCustomerReducer,
  {
    setSelectedTable,
    setAssignedOperator,
    placeNewOrder,
    addNewOrderItem,
    removeNewOrderItem,
  },
  {
    selectedTable: null,
    assignedOperator: null,
    newlySelectedItems: [],
    tableAccount: null,
  },
);
