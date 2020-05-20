import { AsyncStorage } from 'react-native';
import axios from 'axios';
import useResponse from '../hooks/useResponse';

const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";


const login = (username, password) => {
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json"
      },
    })
    .post("token", { username, password });
  return useResponse(req);
}

const refreshToken = async () => {
  const bearerRefreshToken = await pickBearerRefreshToken();
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerRefreshToken,
      },
    })
    .post("/api/account/token/refresh");
  return useResponse(req);
}

const isAuthorized = async () => {
  const accessTokenSettings = await pickAccessTokenSettings();
  return accessTokenSettings && accessTokenSettings.access_Token;
};

const putAccessTokenSettings = async (accessTokenSettings) => {
  return accessTokenSettings
    ? await AsyncStorage.setItem("accessTokenSettings", JSON.stringify(accessTokenSettings))
    : null;
};
const putRefreshTokenSettings = async (refreshTokenSettings) => {
  return refreshTokenSettings
    ? await AsyncStorage.setItem("refreshTokenSettings", JSON.stringify(refreshTokenSettings))
    : null;
};

const pickAccessTokenSettings = async () => {
  const settings = await AsyncStorage.getItem("accessTokenSettings");
  return settings ? JSON.parse(settings) : null;
};
const pickRefreshTokenSettings = async () => {
  const settings = await AsyncStorage.getItem("refreshTokenSettings");
  return settings ? JSON.parse(settings) : null;
};

const eraseAccessTokenSettings = async () => await AsyncStorage.removeItem("accessTokenSettings");
const eraseRefreshTokenSettings = async () => await AsyncStorage.removeItem("refreshTokenSettings");

const pickBearerAccessToken = async () => {
  const settings = await pickAccessTokenSettings();
  return settings ? `Bearer ${settings.access_Token}` : null;
};
const pickBearerRefreshToken = async () => {
  const settings = await pickRefreshTokenSettings();
  return settings ? `Bearer ${settings.access_Token}` : null;
};
const pickAccessTokenExpiresSec = async () => {
  const settings = await pickAccessTokenSettings();
  return settings ? settings.expires_in : null;
};
const pickRefreshTokenExpiresSec = async () => {
  const settings = await pickRefreshTokenSettings();
  return settings ? settings.expires_in : null;
};

const signup = (email, password, confirmPassword) => {
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json"
      },
    })
    .post("/api/account/signupmobile", {
      email: email.trim(),
      password: password.trim(),
      confirmPassword,
      originMobile: true,
      isManager: false
    });
  return useResponse(req);
}



export const authService = {
  login,
  signup,
  refreshToken,
  isAuthorized,
  putAccessTokenSettings,
  putRefreshTokenSettings,
  eraseAccessTokenSettings,
  eraseRefreshTokenSettings,
  pickAccessTokenSettings,
  pickRefreshTokenSettings,
  pickBearerAccessToken,
  pickBearerRefreshToken,
  pickAccessTokenExpiresSec,
  pickRefreshTokenExpiresSec,
};
