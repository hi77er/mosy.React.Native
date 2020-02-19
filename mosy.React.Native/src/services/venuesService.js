import { authService } from './authService';
import axios from 'axios';



const getClosestVenues = ({ latitude, longitude }) => {
  const bearerAccessToken = await authService.pickBearerAccessToken();
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