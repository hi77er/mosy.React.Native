import { AsyncStorage } from 'react-native';
import axios from 'axios';

import { authService } from './authService';
import useResponse from '../hooks/useResponse';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";

const getClosestDishes = async (
  latitude,
  longitude,
  maxResultsCount = 10,
  totalItemsOffset = 0,
  query = "",
  selectedDishTypeFilterIds = [],
  selectedDrinksFilterIds = [],
  selectedDishRegionFilterIds = [],
  selectedDishMainIngredientFilterIds = [],
  selectedDishAllergenFilterIds = [],
  showNotRecommendedDishes = false,
  showNotWorkingVenues = true,
  localDateTimeOffset = "2020-02-19T18:26:53.693Z",
  searchedDistanceMeters = 10000,
  isDevModeActivated = false,
) => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();

  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post(
      "/api/dishes/closest",
      {
        latitude,
        longitude,
        maxResultsCount,
        totalItemsOffset,
        query,
        selectedDishTypeFilterIds,
        selectedDrinksFilterIds,
        selectedDishRegionFilterIds,
        selectedDishMainIngredientFilterIds,
        selectedDishAllergenFilterIds,
        showNotRecommendedDishes,
        showNotWorkingVenues,
        localDateTimeOffset,
        searchedDistanceMeters,
        isDevModeActivated,
      }
    );
  return useResponse(req);
}

const getImageContent = async (imageMetaId, size) => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();

  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .get("/api/dishes/images/get", { params: { imageMetaId, size } });

  return useResponse(req);
}


export const dishesService = {
  getClosestDishes,
  getImageContent,
};