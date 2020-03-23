import { authService } from './authService';
import useResponse from '../hooks/useResponse';
import axios from 'axios';
import { AsyncStorage } from 'react-native';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";



const getClosestVenues = async (
  latitude,
  longitude,
  maxResultsCount = 10,
  totalItemsOffset = 0,
  query = "",
  selectedVenueAccessibilityFilterIds = [],
  selectedVenueAvailabilityFilterIds = [],
  selectedVenueAtmosphereFilterIds = [],
  selectedVenueCultureFilterIds = [],
  showNotWorkingVenues = true,
  localDateTimeOffset = "2020-02-19T10:33:55.585Z",
  searchedDistanceMeters = 10000,
  isDevModeActivated = true
) => {
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
      "/api/fbo/closest",
      {
        latitude,
        longitude,
        maxResultsCount,
        totalItemsOffset,
        query,
        selectedVenueAccessibilityFilterIds,
        selectedVenueAvailabilityFilterIds,
        selectedVenueAtmosphereFilterIds,
        selectedVenueCultureFilterIds,
        showNotWorkingVenues,
        localDateTimeOffset,
        searchedDistanceMeters,
        isDevModeActivated,
      }
    );

  return useResponse(req);
}

const getVenue = async (id) => {
  const bearerAccessToken = `Bearer ${JSON.parse(await AsyncStorage.getItem("accessTokenSettings")).access_token}`; // await authService.pickBearerAccessToken();
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .get("/api/fbo/id", { params: { id } });

  return useResponse(req);
}


export const venuesService = {
  getClosestVenues,
  getVenue,
};