import { authService } from './authService';
import useResponse from '../hooks/useResponse';
import axios from 'axios';
import { AsyncStorage } from 'react-native';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";

const getFilters = async () => {
  const bearerAccessToken = `Bearer ${JSON.parse(await AsyncStorage.getItem("accessTokenSettings")).access_token}`; // await authService.pickBearerAccessToken();
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .get("/api/filters/all");
  return useResponse(req);
}


export const filterService = {
  getFilters,
};