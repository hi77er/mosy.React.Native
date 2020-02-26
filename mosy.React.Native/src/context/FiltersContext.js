import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { authService } from '../services/authService';
import { filterService } from '../services/filterService';

const filtersReducer = (state, action) => {
  let result = state;

  result = {
    ...state,
    venueFilters: action.payload && action.payload.length ? action.payload.filter((x) => x.filteredType == 1) : null,
    dishFilters: action.payload && action.payload.length ? action.payload.filter((x) => x.filteredType == 2) : null,
  };
  return result;
};

const loadFilters = (dispatch) => {
  return async () => {
    const result = await filterService.getFilters();
    console.log(result);
    dispatch({ type: 'loadFilters', payload: result });
  };
};

export const { Provider, Context } = createDataContext(
  filtersReducer,
  { loadFilters },
  {
    venueFilters: null,
    dishFilters: null,
  },
);
