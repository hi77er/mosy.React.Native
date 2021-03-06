import { AsyncStorage } from 'react-native';
import axios from 'axios';

import useResponse from '../hooks/useResponse';
import { authService } from './authService';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";

const loadTableAccounts = async (venueId, tableRegionIds) => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();

  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post("/api/tablesaccounts/forvenue", { fboId: venueId, tableRegionIds });
  return useResponse(req);
}

const loadAccount = async (venueId, openerUsername) => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();

  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post("/api/tablesaccounts/foruser", { venueId, openerUsername });
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
  loadAccount,
  loadOrders,
};