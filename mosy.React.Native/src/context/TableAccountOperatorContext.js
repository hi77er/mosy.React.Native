import { AsyncStorage } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { tableAccountsService } from '../services/tableAccountsService';
import { venueTablesService } from '../services/venueTablesService';

const defaultContextState = {
  operatedTableAccounts: null,
  tableAccountOrders: null,
};

const tableAccountOperatorReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'resetToDefault':
      result = defaultContextState;
      break;
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
        operatedTableAccounts:
          state.operatedTableAccounts.filter(ta => ta.id == action.payload.id).length
            ? state
              .operatedTableAccounts
              .map((ta) => {
                if (ta.id == action.payload.id)
                  return {
                    ...ta,
                    status: action.payload.status,
                    assignedOperatorUsername: action.payload.assignedOperatorUsername
                  };
                return ta;
              })
            : [
              action.payload,
              ...state.operatedTableAccounts,
            ],
      };
      break;
    case 'setOrderItem':
      result = {
        ...state,
        tableAccountOrders: [
          ...state.tableAccountOrders.map(
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
        ]
      };
      break;
  }

  return result;
};

const resetToDefault = (dispatch) => {
  return async () => {
    dispatch({ type: 'resetToDefault' });
  };
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
    resetToDefault,
    loadTableAccounts,
    loadOrders,
    loadUnocupiedTables,
    setOperatedTableAccount,
    setOrderItem,
  },
  defaultContextState,
);
