import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { authService } from '../services/authService';
import { filterService } from '../services/filterService';

const filtersReducer = (state, action) => {
  let newState = state;

  switch (action.type) {
    case 'loadFilters':
      newState = {
        ...state,
        filters: action.payload && action.payload.length
          ? action.payload
          : [],
      };
      break;

    case 'setSelectedFilters':
      const currentSelected = state.selectedFilters && state.selectedFilters.length
        ? state.selectedFilters.filter(x => x.filterType != action.payload.filterType)
        : [];

      const newlySelected = state.filters && state.filters.length
        ? state.filters
          .filter(
            x => action.payload.selectedFilterIds && action.payload.selectedFilterIds
              ? action.payload.selectedFilterIds
                .filter(y => y == x.id)
                .length
              : []
          )
        : [];

      newState = {
        ...state,
        selectedFilters: [...currentSelected, ...newlySelected],
      };
      break;

    case 'setShowClosedVenues':
      newState = { ...state, showClosedVenues: action.payload };
      break;

    case 'setShowClosedDishes':
      newState = { ...state, showClosedDishes: action.payload };
      break;

    case 'setShowRecommendedDishes':
      newState = { ...state, showRecommendedDishes: action.payload };
      break;

    case 'resetFilters':
      newState = {
        ...state,
        selectedFilters: state.selectedFilters && state.selectedFilters.length
          ? state.selectedFilters.filter(x => x.filteredType != action.payload.filteredType)
          : state.selectedFilters,
        showClosedVenues: action.payload.filteredType == 1 ? false : state.showClosedVenues,
        showClosedDishes: action.payload.filteredType == 2 ? false : state.showClosedDishes,
        showRecommendedDishes: action.payload.filteredType == 2 ? true : state.showRecommendedDishes,
      }
      break;
  };

  newState = {
    ...newState,
    venuesFiltersChanged:
      (newState.selectedFilters
        && newState.selectedFilters.length
        && newState.selectedFilters.filter(x => x.filteredType == 1).length)
      || newState.showClosedVenues,
    dishesFiltersChanged:
      (newState.selectedFilters
        && newState.selectedFilters.length
        && newState.selectedFilters.filter(x => x.filteredType == 2).length)
      || newState.showClosedDishes
      || !newState.showRecommendedDishes,
  };
  return newState;
};



const loadFilters = (dispatch) => {
  return async () => {
    const result = await filterService.getFilters();
    dispatch({ type: 'loadFilters', payload: result });
  };
};

const setSelectedFilters = (dispatch) => {
  return async ({ filterType, selectedFilterIds }) => {
    dispatch({ type: 'setSelectedFilters', payload: { filterType, selectedFilterIds } });
  };
};

const setShowClosedVenues = (dispatch) => {
  return async (showClosedVenues) => {
    dispatch({ type: 'setShowClosedVenues', payload: showClosedVenues });
  };
}

const setShowClosedDishes = (dispatch) => {
  return async (showClosedDishes) => {
    dispatch({ type: 'setShowClosedDishes', payload: showClosedDishes });
  };
}

const setShowRecommendedDishes = (dispatch) => {
  return async (showRecommendedDishes) => {
    dispatch({ type: 'setShowRecommendedDishes', payload: showRecommendedDishes });
  };
}

const resetFilters = (dispatch) => {
  return async (filteredType) => {
    dispatch({ type: 'resetFilters', payload: { filteredType } });
  };
}

export const { Provider, Context } = createDataContext(
  filtersReducer,
  {
    loadFilters,
    setSelectedFilters,
    setShowClosedVenues,
    setShowClosedDishes,
    setShowRecommendedDishes,
    resetFilters,
  },
  {
    filters: [],
    selectedFilters: [],
    showClosedVenues: false,
    showClosedDishes: false,
    showRecommendedDishes: true,
    dishesFiltersChanged: false,
    venuesFiltersChanged: false,
  },
);
