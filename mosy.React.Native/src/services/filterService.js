import { AsyncStorage } from 'react-native';
import axios from 'axios';

import { authService } from './authService';
import useResponse from '../hooks/useResponse';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";

const getFilters = async () => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();
  
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