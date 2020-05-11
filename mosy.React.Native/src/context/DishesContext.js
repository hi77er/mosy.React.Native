import createDataContext from './createDataContext';
import { dishesService } from '../services/dishesService';


let currentState = null;

const dishesReducer = (state, action) => {
  currentState = state;
  let unbundledClosestDishes = state.unbundledClosestDishes;

  switch (action.type) {
    case 'clearDishes':
      currentState = { ...state, unbundledClosestDishes: [], bundledClosestDishes: [] };
      break;
    case 'loadDishes':
      const { foundDishes, resetResults, maxResultsCount } = action.payload;
      const dishes = foundDishes && foundDishes.length ? foundDishes : [];

      const existingIds = state.unbundledClosestDishes.map(x => x.id);
      const unique = dishes.filter(x => !existingIds.includes(x.id));

      const unbundled = resetResults ? dishes : [...state.unbundledClosestDishes, ...unique];

      const grouped = unbundled
        .reduce((resultGroups, dishItem) => {
          const matchingFiltersIds = dishItem.matchingFiltersIds && dishItem.matchingFiltersIds.length
            ? dishItem.matchingFiltersIds.sort()
            : null;
          const mismatchingFiltersIds = dishItem.mismatchingFiltersIds && dishItem.mismatchingFiltersIds.length
            ? dishItem.mismatchingFiltersIds.sort()
            : null;

          const keyPart1 = matchingFiltersIds && matchingFiltersIds.length
            ? matchingFiltersIds.join("|")
            : "";
          const keyPart2 = mismatchingFiltersIds && mismatchingFiltersIds.length
            ? mismatchingFiltersIds.join("|")
            : "";
          const key = `${keyPart1}-${keyPart2}`;

          resultGroups[key] = resultGroups[key] || [];
          resultGroups[key].push(dishItem);

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
        bundledClosestDishes: bundled,
        unbundledClosestDishes: unbundled,
        isRefreshingClosestDishes: false,
        hasMoreClosestDishResults: dishes.length == maxResultsCount,
      };

      break;
    case 'startRefreshingClosestDishes':
      currentState = { ...state, isRefreshingClosestDishes: true };
      break;
    case 'loadImageContent':
      const { imageMetaId, imageContent, size } = action.payload;

      unbundledClosestDishes = state.unbundledClosestDishes.map(x => {

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
      currentState = { ...state, unbundledClosestDishes };
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
  return async (maxResultsCount, currentUnbundledClosestDishes, latitude, longitude, selectedFilters, searchQuery, showNotWorkingVenues, showNotRecommendedDishes, resetResults) => {
    dishesService
      .getClosestDishes(
        latitude, longitude, maxResultsCount, currentUnbundledClosestDishes.length, searchQuery,
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
    bundledClosestDishes: [],
    unbundledClosestDishes: [],
    isRefreshingClosestDishes: false,
    hasMoreClosestDishResults: true,
  },
);
