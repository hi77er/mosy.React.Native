import { authService } from './authService';
import useResponse from '../hooks/useResponse';
import axios from 'axios';
import { AsyncStorage } from 'react-native';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";



const getClosestVenues = async ({ latitude, longitude }) => {
  const bearerAccessToken = `Bearer ${JSON.parse(await AsyncStorage.getItem("accessTokenSettings")).access_token}`; // await authService.pickBearerAccessToken();
  console.log(bearerAccessToken);
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post(
      "/api/fbo/closest",
      {
        latitude,
        longitude,
        MaxResultsCount: 0,
        TotalItemsOffset: 0,
        Query: "",
        SelectedVenueAccessibilityFilterIds: [],
        SelectedVenueAvailabilityFilterIds: [],
        SelectedVenueAtmosphereFilterIds: [],
        SelectedVenueCultureFilterIds: [],
        ShowNotWorkingVenues: true,
        LocalDateTimeOffset: "2020-02-19T10:33:55.585Z",
        SearchedDistanceMeters: 0,
        IsDevModeActivated: true
      }
    )
  return useResponse(req);
}


export const venuesService = {
  getClosestVenues,
};