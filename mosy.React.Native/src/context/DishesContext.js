import createDataContext from './createDataContext';
import { dishesService } from '../services/dishesService';


let currentState = null;

const dishesReducer = (state, action) => {
  currentState = state;
  let closestDishes = state.closestDishes;

  switch (action.type) {
    case 'clearDishes':
      currentState = { ...state, closestDishes: [] };
      break;
    case 'loadDishes':
      const { foundDishes, resetResults, maxResultsCount } = action.payload;
      const dishes = foundDishes && foundDishes.length ? foundDishes : [];

      const existingIds = state.closestDishes.map(x => x.id);
      const unique = dishes.filter(x => !existingIds.includes(x.id));

      currentState = {
        ...state,
        closestDishes: resetResults ? dishes : [...state.closestDishes, ...unique],
        isRefreshingClosestDishes: false,
        hasMoreClosestDishResults: dishes.length == maxResultsCount,
      };

      break;
    case 'startRefreshingClosestDishes':
      currentState = { ...state, isRefreshingClosestDishes: true };
      break;
    case 'loadImageContent':
      const { imageMetaId, imageContent, size } = action.payload;

      closestDishes = state.closestDishes.map(x => {

        if (x.requestableImageMeta) {

          switch (size) {
            case 0:
              x.requestableImageMeta = {
                ...x.requestableImageMeta,
                base64Original: x.id == action.payload.dishId ? imageContent : x.requestableImageMeta.base64Original,
              };
              break;
            case 1:
              x.requestableImageMeta = {
                ...x.requestableImageMeta,
                base64x100: x.id == action.payload.dishId ? imageContent : x.requestableImageMeta.base64x100,
              };
              break;
            case 2:
              x.requestableImageMeta = {
                ...x.requestableImageMeta,
                base64x200: x.id == action.payload.dishId ? imageContent : x.requestableImageMeta.base64x200,
              };
              break;
            case 3:
              x.requestableImageMeta = {
                ...x.requestableImageMeta,
                base64x300: x.id == action.payload.dishId ? imageContent : x.requestableImageMeta.base64x300,
              };
              break;
          }
        } else {
          switch (size) {
            case 0:
              x = {
                ...x,
                requestableImageMeta: x.id == action.payload.dishId
                  ? { id: imageMetaId, base64Original: imageContent }
                  : x.requestableImageMeta
              };
              break;
            case 1:
              x = {
                ...x,
                requestableImageMeta: x.id == action.payload.dishId
                  ? { id: imageMetaId, base64x100: imageContent }
                  : x.requestableImageMeta
              };
              break;
            case 2:
              x = {
                ...x,
                requestableImageMeta: x.id == action.payload.dishId
                  ? { id: imageMetaId, base64x200: imageContent }
                  : x.requestableImageMeta
              };
              break;
            case 3:
              x = {
                ...x,
                requestableImageMeta: x.id == action.payload.dishId
                  ? { id: imageMetaId, base64x300: imageContent }
                  : x.requestableImageMeta
              };
              break;
          }
        }
        return x;
      });
      currentState = { ...state, closestDishes };
      break;
  };

  return currentState;
}

const clearDishes = (dispatch) => {
  return async () => {
    dispatch({ type: 'clearDishes' });
  };
};

const loadDishes = (dispatch) => {
  return async (maxResultsCount, currentClosestDishes, latitude, longitude, selectedFilters, searchQuery, showNotWorkingVenues, showNotRecommendedDishes, resetResults) => {
    dishesService
      .getClosestDishes(
        latitude, longitude, maxResultsCount, currentClosestDishes.length, searchQuery,
        selectedFilters.filter(x => x.filterType == 201).map(x => x.id),
        selectedFilters.filter(x => x.filterType == 205).map(x => x.id),
        selectedFilters.filter(x => x.filterType == 202).map(x => x.id),
        selectedFilters.filter(x => x.filterType == 203).map(x => x.id),
        selectedFilters.filter(x => x.filterType == 204).map(x => x.id),
        showNotRecommendedDishes, showNotWorkingVenues
      )
      .then((foundDishes) => {
        if (foundDishes) {
          dispatch({ type: 'loadDishes', payload: { foundDishes, resetResults, maxResultsCount } });
        }
      })
      .catch((err) => console.log(err));
  };
};

const startRefreshingClosestDishes = (dispatch) => {
  return async () => {
    dispatch({ type: 'startRefreshingClosestDishes' });
  };
};

const loadImageContent = (dispatch) => {
  return async (dishId, imageMetaId, size) => {
    const imageContent = await dishesService.getImageContent(imageMetaId, size);

    dispatch({ type: 'loadImageContent', payload: { imageContent: imageContent.base64Content, imageMetaId, size, dishId } });
  };
};

export const { Provider, Context } = createDataContext(
  dishesReducer,
  {
    clearDishes,
    loadDishes,
    startRefreshingClosestDishes,
    loadImageContent,
  },
  {
    closestDishes: [],
    isRefreshingClosestDishes: false,
    hasMoreClosestDishResults: true,
  },
);
