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
    case 'setOperatedTableAccount':
      result = {
        ...state,
        operatedTableAccounts: state
          .operatedTableAccounts
          .map((ta) => {
            if (ta.id == action.payload.id || ta.id == action.payload.Id)
              return {
                ...ta,
                status: action.payload.status || action.payload.Status,
                assignedOperatorUsername: action.payload.assignedOperatorUsername || action.payload.AssignedOperatorUsername
              };
            return ta;
          }),
      };
      break;
    case 'setOrderItem':
      result = {
        ...state,
        tableAccountOrders: [
          ...state.tableAccountOrders.map(
            (order) => {
              if (order.id == action.payload.OrderId) {
                order = {
                  ...order,
                  orderRequestables: order.orderRequestables.map(or => {
                    if (or.id == action.payload.Id) {
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
        ]
      };
      break;
  }

  return result;
};

const loadTableAccounts = (dispatch) => {
  return async (venueId, tableRegionIds) => {
    const result = await tableAccountsService.loadTableAccounts(venueId, tableRegionIds);
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

const setOperatedTableAccount = (dispatch) => {
  return async (tableAccount) => {
    dispatch({ type: 'setOperatedTableAccount', payload: tableAccount });
  };
};

const setOrderItem = (dispatch) => {
  return async (orderItemResult) => {
    dispatch({ type: 'setOrderItem', payload: orderItemResult });
  };
};


export const { Provider, Context } = createDataContext(
  tableAccountOperatorReducer,
  {
    loadTableAccounts,
    loadOrders,
    loadUnocupiedTables,
    setOperatedTableAccount,
    setOrderItem,
  },
  {
    operatedTableAccounts: null,
    tableAccountOrders: null,
  },
);
