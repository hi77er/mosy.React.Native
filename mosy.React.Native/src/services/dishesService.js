import { authService } from './authService';
import useResponse from '../hooks/useResponse';
import axios from 'axios';
import { AsyncStorage } from 'react-native';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";



const getClosestDishes = async ({ latitude, longitude }) => {
  const bearerAccessToken = `Bearer ${JSON.parse(await AsyncStorage.getItem("accessTokenSettings")).access_token}`; // await authService.pickBearerAccessToken();
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
        MaxResultsCount: 10,
        TotalItemsOffset: 0,
        Query: "",
        SelectedDishTypeFilterIds: [],
        SelectedDrinksFilterIds: [],
        SelectedDishRegionFilterIds: [],
        SelectedDishMainIngredientFilterIds: [],
        SelectedDishAllergenFilterIds: [],
        ShowNotRecommendedDishes: false,
        ShowNotWorkingVenues: true,
        LocalDateTimeOffset: "2020-02-19T18:26:53.693Z",
        SearchedDistanceMeters: 10000,
        IsDevModeActivated: false,
      }
    );
  return useResponse(req);
}


export const dishesService = {
  getClosestDishes,
};