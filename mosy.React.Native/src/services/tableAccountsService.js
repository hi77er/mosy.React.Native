import { AsyncStorage } from 'react-native';
import axios from 'axios';

import useResponse from '../hooks/useResponse';
import { authService } from './authService';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";

const loadTableAccounts = async (venueId) => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();

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

const loadOrders = async (tableAccountId) => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();

  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post("/api/tablesaccounts/orders", { tableAccountId });
  return useResponse(req);
}



export const tableAccountsService = {
  loadTableAccounts,
  loadOrders,
};