import { authService } from './authService';
import useResponse from '../hooks/useResponse';
import axios from 'axios';
import { AsyncStorage } from 'react-native';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";


const loadTableAccounts = async (venueId) => {
  const bearerAccessToken = `Bearer ${JSON.parse(await AsyncStorage.getItem("accessTokenSettings")).access_token}`; // await authService.pickBearerAccessToken();
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post("/api/tablesaccounts/forvenue", { fboId: venueId });
  return useResponse(req);
}

export const tableAccountsService = {
  loadTableAccounts,
};