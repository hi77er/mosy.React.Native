import { AsyncStorage } from 'react-native';
import axios from 'axios';

import { authService } from './authService';
import useResponse from '../hooks/useResponse';

const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";


const getUser = async () => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post("/api/user/profile");
  return useResponse(req);
}

const getImageContent = async (size) => {
  const bearerAccessToken = await authService.pickValidBearerAccessToken();

  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .get("/api/user/image/get", { params: { size } });
  return useResponse(req);
}


const isUserAuthorized = (userWithRoles) => {
  return userWithRoles
    && userWithRoles.roles
    && userWithRoles.roles.length
    && (
      userWithRoles.roles.filter(x => x.name == 'Ninja').length
      || userWithRoles.roles.filter(x => x.name == 'Mnager').length
      || userWithRoles.roles.filter(x => x.name == 'TableAccountOperator').length
      || userWithRoles.roles.filter(x => x.name == 'MonitorOperator').length
      || userWithRoles.roles.filter(x => x.name == 'Deliverer').length
      || userWithRoles.roles.filter(x => x.name == 'DeliveryAdministrator').length
      || userWithRoles.roles.filter(x => x.name == 'Consumer').length
    );
};

const isWebApiAuthorized = (userWithRoles) => {
  return userWithRoles
    && userWithRoles.roles
    && userWithRoles.roles.length
    && userWithRoles.roles.filter(x => x.name == 'WebApiUser').length;
};

const isUserOrWebApiAuthorized = (userWithRoles) => {
  return userWithRoles
    && userWithRoles.roles
    && userWithRoles.roles.length
    && (
      userWithRoles.roles.filter(x => x.name == 'Ninja').length
      || userWithRoles.roles.filter(x => x.name == 'Mnager').length
      || userWithRoles.roles.filter(x => x.name == 'TableAccountOperator').length
      || userWithRoles.roles.filter(x => x.name == 'MonitorOperator').length
      || userWithRoles.roles.filter(x => x.name == 'Deliverer').length
      || userWithRoles.roles.filter(x => x.name == 'DeliveryAdministrator').length
      || userWithRoles.roles.filter(x => x.name == 'Consumer').length
      || userWithRoles.roles.filter(x => x.name == 'WebApiUser').length
    );
};

export const userService = {
  getUser,
  getImageContent,
  isWebApiAuthorized,
  isUserAuthorized,
  isUserOrWebApiAuthorized,
};
