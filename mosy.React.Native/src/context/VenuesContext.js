import createDataContext from './createDataContext';
import { venuesService } from '../services/venuesService';


let currentState = null;

const venuesReducer = (state, action) => {
  currentState = state;

  switch (action.type) {
    case 'loadVenues':
      const { foundVenues, resetResults, maxResultsCount } = action.payload;
      const venues = foundVenues && foundVenues.length ? foundVenues : [];

      currentState = {
        ...state,
        closestVenues: resetResults ? venues : [...state.closestVenues, ...venues],
        isRefreshingClosestVenues: false,
        hasMoreClosestVenueResults: venues.length == maxResultsCount,
      };

      break;
    case 'loadVenue':
      const detailedVenue = action.payload;

      currentState = { ...state, detailedVenues: [detailedVenue, ...state.detailedVenues], };
      break;
    case 'startRefreshingClosestVenues':
      currentState = { ...state, isRefreshingClosestVenues: true };
      break;
  };

  return currentState;
}


const loadVenue = (dispatch) => {
  return async (id) => {
    const detailedVenue = await venuesService.loadVenue(id);

    dispatch({ type: 'loadVenue', payload: detailedVenue });
  };
};

const loadVenues = (dispatch) => {
  return async (maxResultsCount, currentClosestVenues, latitude, longitude, selectedFilters, searchQuery, showClosedVenues, resetResults) => {
    venuesService
      .getClosestVenues(
        latitude, longitude, maxResultsCount, currentClosestVenues.length, searchQuery,
        selectedFilters.filter(x => x.filterType == 101).map(x => x.id),
        selectedFilters.filter(x => x.filterType == 102).map(x => x.id),
        selectedFilters.filter(x => x.filterType == 103).map(x => x.id),
        selectedFilters.filter(x => x.filterType == 104).map(x => x.id),
        showClosedVenues
      )
      .then((foundVenues) => {
        if (foundVenues) {
          dispatch({ type: 'loadVenues', payload: { maxResultsCount, resetResults, foundVenues } });
        }
      })
      .catch((err) => console.log(err));
  };
};

const startRefreshingClosestVenues = (dispatch) => {
  return async () => {
    dispatch({ type: 'startRefreshingClosestVenues' });
  };
};

export const { Provider, Context } = createDataContext(
  venuesReducer,
  {
    loadVenues,
    loadVenue,
    startRefreshingClosestVenues,
  },
  {
    closestVenues: [],
    detailedVenues: [],
    isRefreshingClosestVenues: false,
    hasMoreClosestVenueResults: true,
  },
);
