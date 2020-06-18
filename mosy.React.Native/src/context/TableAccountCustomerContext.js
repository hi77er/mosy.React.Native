import { AsyncStorage } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { tableAccountsService } from '../services/tableAccountsService';
import { venueTablesService } from '../services/venueTablesService';

const defaultContextState = {
  newlySelectedTable: null,
  newlySelectedItems: [],
  tableAccount: null,
};

const tableAccountCustomerReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'resetToDefault':
      result = defaultContextState;
      break;
    case 'setSelectedTable':
      result = { ...state, newlySelectedTable: action.payload, };
      break;
    case 'setAssignedOperator':
      result = { ...state, assignedOperator: action.payload, };
      break;
    case 'addNewOrderItem':
      result = { ...state, newlySelectedItems: [...state.newlySelectedItems, action.payload] };
      break;
    case 'removeNewOrderItem':
      let matchingIndexes = [];

      if (state.newlySelectedItems
        && state.newlySelectedItems.length
        && state.newlySelectedItems.filter(item => item.id == action.payload).length) {

        state
          .newlySelectedItems
          .forEach((item, index) => {
            if (item.id == action.payload)
              matchingIndexes = [...matchingIndexes, index];
            return item;
          });
      }

      result = {
        ...state,
        newlySelectedItems: matchingIndexes.length
          ? state.newlySelectedItems.slice(0, matchingIndexes[0]).concat(state.newlySelectedItems.slice(matchingIndexes[0] + 1, state.newlySelectedItems.length))
          : state.newlySelectedItems
      };
      break;
    case 'setTableAccount':
      result = { ...state, tableAccount: action.payload, };
      break;
    case 'setOrderItem':
      result = {
        ...state,
        tableAccount: {
          ...state.tableAccount,
          orders: state.tableAccount.orders.map(
            (order) => {
              if (order.id == action.payload.orderId) {
                order = {
                  ...order,
                  orderRequestables: order.orderRequestables.map(or => {
                    if (or.id == action.payload.id) {
                      or = {
                        ...or,
                        status: action.payload.status,
                      };
                    }
                    return or;
                  }),
                };
              }
              return order;
            }
          )
        }
      };
      break;
    case 'loadOrders':
      result = {
        ...state,
        tableAccount: {
          ...state.tableAccount,
          orders: action.payload,
        },
      };
      break;
    case 'loadAccount':
      result = { ...state, tableAccount: action.payload, };
      break;
  }

  return result;
};

const resetToDefault = (dispatch) => {
  return async () => {
    dispatch({ type: 'resetToDefault' });
  };
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


const setTableAccount = (dispatch) => {
  return async (tableAccount) => {
    dispatch({ type: 'setTableAccount', payload: tableAccount });
  };
};

const setOrderItem = (dispatch) => {
  return async (orderItemResult) => {
    dispatch({ type: 'setOrderItem', payload: orderItemResult });
  };
};

const loadOrders = (dispatch) => {
  return async (tableAccountId) => {
    const result = await tableAccountsService.loadOrders(tableAccountId);
    dispatch({ type: 'loadOrders', payload: result });
  };
};

const loadAccount = (dispatch) => {
  return async (venueId, openerUsername) => {
    const result = await tableAccountsService.loadAccount(venueId, openerUsername);
    dispatch({ type: 'loadAccount', payload: result });
  };
};


export const { Provider, Context } = createDataContext(
  tableAccountCustomerReducer,
  {
    resetToDefault,
    setSelectedTable,
    setTableAccount,
    addNewOrderItem,
    removeNewOrderItem,
    setAssignedOperator,
    setOrderItem,
    loadOrders,
    loadAccount,
  },
  defaultContextState,
);
