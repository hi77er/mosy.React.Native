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
    case 'setTableAccount':
      result = { ...state, tableAccount: action.payload, };
      break;
    case 'setOrderItem':
      result = {
        ...state,
        tableAccount: {
          ...state.tableAccount,
          orders: (state.tableAccount.orders || state.tableAccount.Orders).map(
            (order) => {
              if (order.id == action.payload.OrderId || order.Id == action.payload.OrderId) {
                order = {
                  ...order,
                  orderRequestables: (order.orderRequestables || order.OrderRequestables).map(or => {
                    if (or.id == action.payload.Id || or.Id == action.payload.Id) {
                      or = {
                        ...or,
                        status: action.payload.Status,
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
    console.log(tableAccountId);
    console.log(result);
    dispatch({ type: 'loadOrders', payload: result });
  };
};


export const { Provider, Context } = createDataContext(
  tableAccountCustomerReducer,
  {
    setSelectedTable,
    setTableAccount,
    addNewOrderItem,
    removeNewOrderItem,
    setAssignedOperator,
    setOrderItem,
    loadOrders,
  },
  {
    selectedTable: null,
    assignedOperator: null,
    newlySelectedItems: [],
    tableAccount: null,
  },
);
