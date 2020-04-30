import createDataContext from './createDataContext';
import { venuesService } from '../services/venuesService';


let currentState = null;

const venuesReducer = (state, action) => {
  currentState = state;
  let unbundledClosestVenues = state.unbundledClosestVenues;

  switch (action.type) {
    case 'clearVenues':
      currentState = { ...state, unbundledClosestVenues: [] };
      break;
    case 'loadVenues':
      const { foundVenues, resetResults, maxResultsCount } = action.payload;
      const venues = foundVenues && foundVenues.length ? foundVenues : [];

      const existingIds = state.unbundledClosestVenues.map(x => x.id);
      const unique = venues.filter(x => !existingIds.includes(x.id));

      const unbundled = resetResults ? venues : [...state.unbundledClosestVenues, ...unique];

      const grouped = unbundled
        .reduce((resultGroups, venueItem) => {
          const matchingFiltersIds = venueItem.matchingFiltersIds && venueItem.matchingFiltersIds.length
            ? venueItem.matchingFiltersIds.sort()
            : null;
          const mismatchingFiltersIds = venueItem.mismatchingFiltersIds && venueItem.mismatchingFiltersIds.length
            ? venueItem.mismatchingFiltersIds.sort()
            : null;

          const keyPart1 = matchingFiltersIds && matchingFiltersIds.length
            ? matchingFiltersIds.join("|")
            : "";
          const keyPart2 = mismatchingFiltersIds && mismatchingFiltersIds.length
            ? mismatchingFiltersIds.join("|")
            : "";
          const key = `${keyPart1}-${keyPart2}`;

          resultGroups[key] = resultGroups[key] || [];
          resultGroups[key].push(venueItem);

          return resultGroups;
        }, {});

      const bundled = [];
      Object.entries(grouped).forEach(([key, items]) => {
        if (items && items.length) {
          if (key !== '-') {

            bundled.push(
              {
                renderType: 1,//"MATCHING_FILTERS_ITEM",
                renderItem: {
                  matchingFiltersIds: items[0].matchingFiltersIds,
                  mismatchingFiltersIds: items[0].mismatchingFiltersIds,
                }
              }
            );
          }

          items.forEach((item) =>
            bundled.push(
              {
                renderType: 2,//"DISH_ITEM",
                renderItem: item,
              }
            )
          );
        }
      });

      currentState = {
        ...state,
        //closestVenues: resetResults ? venues : [...state.closestVenues, ...unique],
        bundledClosestVenues: bundled,
        unbundledClosestVenues: unbundled,
        isRefreshingClosestVenues: false,
        hasMoreClosestVenueResults: venues.length == maxResultsCount,
      };

      break;
    case 'startRefreshingClosestVenues':
      currentState = { ...state, isRefreshingClosestVenues: true };
      break;
    case 'loadLocation':
      const { venueLocation } = action.payload;
      unbundledClosestVenues = state.unbundledClosestVenues.map(x => {
        x.fboLocation = x.id == action.payload.venueId ? venueLocation : x.fboLocation;
        return x;
      });
      currentState = { ...state, unbundledClosestVenues };
      break;
    case 'loadContacts':
      const { venueContacts } = action.payload;
      unbundledClosestVenues = state.unbundledClosestVenues.map(x => {
        x.fboContacts = x.id == action.payload.venueId ? venueContacts : x.fboContacts;
        return x;
      });
      currentState = { ...state, unbundledClosestVenues };
      break;
    case 'loadImageContent':
      const { isExterior, imageMetaId, imageContent, size } = action.payload;

      unbundledClosestVenues = state.unbundledClosestVenues.map(x => {

        if ((isExterior && x.outdoorImageMeta) || (!isExterior && x.indoorImageMeta)) {

          switch (size) {
            case 0:
              if (isExterior)
                x.outdoorImageMeta = {
                  ...x.outdoorImageMeta,
                  base64Original: x.id == action.payload.venueId ? imageContent : x.outdoorImageMeta.base64Original,
                };
              else
                x.indoorImageMeta = {
                  ...x.indoorImageMeta,
                  base64Original: x.id == action.payload.venueId ? imageContent : x.indoorImageMeta.base64Original,
                };
              break;
            case 1:
              if (isExterior)
                x.outdoorImageMeta = {
                  ...x.outdoorImageMeta,
                  base64x100: x.id == action.payload.venueId ? imageContent : x.outdoorImageMeta.base64x100,
                };
              else
                x.indoorImageMeta = {
                  ...x.indoorImageMeta,
                  base64x100: x.id == action.payload.venueId ? imageContent : x.indoorImageMeta.base64x100,
                };
              break;
            case 2:
              if (isExterior)
                x.outdoorImageMeta = {
                  ...x.outdoorImageMeta,
                  base64x200: x.id == action.payload.venueId ? imageContent : x.outdoorImageMeta.base64x200,
                };
              else
                x.indoorImageMeta = {
                  ...x.indoorImageMeta,
                  base64x200: x.id == action.payload.venueId ? imageContent : x.indoorImageMeta.base64x200,
                };
              break;
            case 3:
              if (isExterior)
                x.outdoorImageMeta = {
                  ...x.outdoorImageMeta,
                  base64x300: x.id == action.payload.venueId ? imageContent : x.outdoorImageMeta.base64x300,
                };
              else
                x.indoorImageMeta = {
                  ...x.indoorImageMeta,
                  base64x300: x.id == action.payload.venueId ? imageContent : x.indoorImageMeta.base64x300,
                };
              break;
          }
        } else {
          switch (size) {
            case 0:
              x = {
                ...x,
                outdoorImageMeta: x.id == action.payload.venueId
                  ? (isExterior ? { id: imageMetaId, base64Original: imageContent } : x.outdoorImageMeta)
                  : x.outdoorImageMeta,
                indoorImageMeta: x.id == action.payload.venueId
                  ? (!isExterior ? { id: imageMetaId, base64Original: imageContent } : x.indoorImageMeta)
                  : x.indoorImageMeta,
              };
              break;
            case 1:
              x = {
                ...x,
                outdoorImageMeta: x.id == action.payload.venueId
                  ? (isExterior ? { id: imageMetaId, base64x100: imageContent } : x.outdoorImageMeta)
                  : x.outdoorImageMeta,
                indoorImageMeta: x.id == action.payload.venueId
                  ? (!isExterior ? { id: imageMetaId, base64x100: imageContent } : x.indoorImageMeta)
                  : x.indoorImageMeta,
              };
              break;
            case 2:
              x = {
                ...x,
                outdoorImageMeta: x.id == action.payload.venueId
                  ? (isExterior ? { id: imageMetaId, base64x200: imageContent } : x.outdoorImageMeta)
                  : x.outdoorImageMeta,
                indoorImageMeta: x.id == action.payload.venueId
                  ? (!isExterior ? { id: imageMetaId, base64x200: imageContent } : x.indoorImageMeta)
                  : x.indoorImageMeta,
              };
              break;
            case 3:
              x = {
                ...x,
                outdoorImageMeta: x.id == action.payload.venueId
                  ? (isExterior ? { id: imageMetaId, base64x300: imageContent } : x.outdoorImageMeta)
                  : x.indoorImageMeta,
                indoorImageMeta: x.id == action.payload.venueId
                  ? (!isExterior ? { id: imageMetaId, base64x300: imageContent } : x.indoorImageMeta)
                  : x.indoorImageMeta,
              };
              break;
          }
        }
        return x;
      });
      currentState = { ...state, unbundledClosestVenues };
      break;
  };

  return currentState;
}

const clearVenues = (dispatch) => {
  return async () => {
    dispatch({ type: 'clearVenues' });
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


const loadLocation = (dispatch) => {
  return async (venueId) => {
    const venueLocation = await venuesService.getLocation(venueId);

    dispatch({ type: 'loadLocation', payload: { venueLocation, venueId } });
  };
};


const loadContacts = (dispatch) => {
  return async (venueId) => {
    const venueContacts = await venuesService.getContacts(venueId);

    dispatch({ type: 'loadContacts', payload: { venueContacts, venueId } });
  };
};

const loadOutdoorImageContent = (dispatch) => {
  return async (venueId, imageMetaId, size) => {
    const imageContent = await venuesService.getImageContent(imageMetaId, size);

    dispatch({ type: 'loadImageContent', payload: { isExterior: true, imageContent: imageContent.base64Content, imageMetaId, size, venueId } });
  };
};

const loadIndoorImageContent = (dispatch) => {
  return async (venueId, imageMetaId, size) => {
    const imageContent = await venuesService.getImageContent(imageMetaId, size);

    dispatch({ type: 'loadImageContent', payload: { isExterior: false, imageContent: imageContent.base64Content, imageMetaId, size, venueId } });
  };
};

export const { Provider, Context } = createDataContext(
  venuesReducer,
  {
    clearVenues,
    loadVenues,
    startRefreshingClosestVenues,
    loadLocation,
    loadContacts,
    loadOutdoorImageContent,
    loadIndoorImageContent,
  },
  {
    bundledClosestVenues: [],
    unbundledClosestVenues: [],
    isRefreshingClosestVenues: false,
    hasMoreClosestVenueResults: true,
  },
);
