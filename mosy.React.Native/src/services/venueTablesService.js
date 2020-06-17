import { AsyncStorage } from 'react-native';
import axios from 'axios';

import { authService } from './authService';
import useResponse from '../hooks/useResponse';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";

const loadUntakenTables = async (venueId) => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();

  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post("/api/fbo/tables/free", { venueId });
  return useResponse(req);
};



export const venueTablesService = {
  loadUntakenTables,
};