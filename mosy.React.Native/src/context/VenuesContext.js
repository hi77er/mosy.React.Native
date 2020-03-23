import createDataContext from './createDataContext';
import { venuesService } from '../services/venuesService';


let currentState = null;

const venuesReducer = (state, action) => {
  currentState = state;

  switch (action.type) {
    case 'loadVenues':
      const { foundVenues, resetResults } = action.payload;
      const venues = foundVenues && foundVenues.length ? foundVenues : [];

      currentState = { ...state, closestVenues: resetResults ? venues : [...closestVenues, ...venues], };
      break;
    case 'getVenue':
      const detailedVenue = action.payload;

      currentState = { ...state, detailedVenues: [detailedVenue, ...state.detailedVenues], };
      break;
  };

  return currentState;
}


const getVenue = (dispatch) => {
  return async (id) => {
    const detailedVenue = await venuesService.getVenue(id);

    dispatch({ type: 'getVenue', payload: detailedVenue });
  };
};

const loadVenues = (dispatch) => {
  return async ({ resetResults, count, latitude, longitude, selectedFilters, venuesSearchQuery, showClosedVenues }) => {
    const filters = selectedFilters && selectedFilters.length ? selectedFilters : [];
    const totalItemsOffset = resetResults ? 0 : currentState.closestVenues.length;

    const foundVenues = await venuesService
      .getClosestVenues(
        latitude, longitude, count, totalItemsOffset, venuesSearchQuery,
        filters.filter(x => x.filterType == 101).map(x => x.id),
        filters.filter(x => x.filterType == 102).map(x => x.id),
        filters.filter(x => x.filterType == 103).map(x => x.id),
        filters.filter(x => x.filterType == 104).map(x => x.id),
        showClosedVenues
      );

    dispatch({ type: 'loadVenues', payload: { foundVenues, resetResults } });
  };
};

export const { Provider, Context } = createDataContext(
  venuesReducer,
  {
    loadVenues,
    getVenue,
  },
  {
    closestVenues: [],
    detailedVenues: [],
  },
);
