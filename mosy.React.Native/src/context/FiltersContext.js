import createDataContext from './createDataContext';
import { filterService } from '../services/filterService';
import { filtersHelper } from '../helpers/filtersHelper';

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
      const preSelectedFilterIds = state.selectedFilters && state.selectedFilters.length
        ? state.selectedFilters.map((x) => x.id)
        : [];

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

      const newFiltersSet = [...currentSelected, ...newlySelected];
      const newFiltersSetIds = newFiltersSet.map((x) => x.id);

      const filtersChanged = filtersHelper.checkFiltersStateChanged(newFiltersSetIds, preSelectedFilterIds);

      newState = {
        ...state,
        selectedFilters: newFiltersSet,
        filtersChanged: state.filtersChanged || filtersChanged
      };
      break;

    case 'setShowClosedVenues':
      newState = {
        ...state,
        showClosedVenues: action.payload,
        filtersChanged: state.filtersChanged || (state.showClosedVenues != action.payload)
      };
      break;

    case 'setShowClosedDishes':
      newState = {
        ...state,
        showClosedDishes: action.payload,
        filtersChanged: state.filtersChanged || state.showClosedDishes !== action.payload
      };
      break;

    case 'setShowRecommendedDishes':
      newState = {
        ...state,
        showRecommendedDishes: action.payload,
        filtersChanged: state.filtersChanged || state.showRecommendedDishes !== action.payload
      };
      break;

    case 'setVenuesSearchQuery':
      newState = {
        ...state,
        venuesSearchQuery: action.payload,
        filtersChanged: state.filtersChanged || state.venuesSearchQuery !== action.payload
      };
      break;

    case 'setDishesSearchQuery':
      newState = {
        ...state,
        dishesSearchQuery: action.payload,
        filtersChanged: state.filtersChanged || state.dishesSearchQuery !== action.payload
      };
      break;

    case 'resetSelectedFilters':
      newState = {
        ...state,
        selectedFilters: state.selectedFilters && state.selectedFilters.length
          ? state.selectedFilters.filter(x => x.filteredType != action.payload.filteredType)
          : state.selectedFilters,
        showClosedVenues: action.payload.filteredType == 1 ? false : state.showClosedVenues,
        showClosedDishes: action.payload.filteredType == 2 ? false : state.showClosedDishes,
        showRecommendedDishes: action.payload.filteredType == 2 ? true : state.showRecommendedDishes,
        venuesSearchQuery: action.payload.filteredType == 1 ? "" : state.venuesSearchQuery,
        dishesSearchQuery: action.payload.filteredType == 2 ? "" : state.dishesSearchQuery,
        filtersChanged: false
      };
      break;

    case 'resetFiltersChanged':
      newState = {
        ...state,
        filtersChanged: false
      };
      break;
  };

  newState = {
    ...newState,
    areDefaultVenueFilters:
      (newState.selectedFilters
        && newState.selectedFilters.length
        && newState.selectedFilters.filter(x => x.filteredType == 1).length)
      || newState.showClosedVenues,
    areDefaultDishFilters:
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

const resetSelectedFilters = (dispatch) => {
  return async (filteredType) => {
    dispatch({ type: 'resetSelectedFilters', payload: { filteredType } });
  };
}

const resetFiltersChanged = (dispatch) => {
  return async () => {
    dispatch({ type: 'resetFiltersChanged', payload: { filtersChanged: false } })
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

const setVenuesSearchQuery = (dispatch) => {
  return async (query) => {
    dispatch({ type: 'setVenuesSearchQuery', payload: query })
  };
};

const setDishesSearchQuery = (dispatch) => {
  return async (query) => {
    dispatch({ type: 'setDishesSearchQuery', payload: query })
  };
};



export const { Provider, Context } = createDataContext(
  filtersReducer,
  {
    loadFilters,
    resetSelectedFilters,
    resetFiltersChanged,
    setSelectedFilters,
    setShowClosedVenues,
    setShowClosedDishes,
    setShowRecommendedDishes,
    setVenuesSearchQuery,
    setDishesSearchQuery,
  },
  {
    filters: [],
    selectedFilters: [],
    showClosedVenues: false,
    showClosedDishes: false,
    showRecommendedDishes: true,
    venuesSearchQuery: "",
    dishesSearchQuery: "",

    areDefaultDishFilters: true,
    areDefaultVenueFilters: true,
    filtersChanged: false,
  },
);
