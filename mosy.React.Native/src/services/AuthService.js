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

const putAccessTokenSettings = async (accessTokenSettings) => await AsyncStorage.setItem("accessTokenSettings", JSON.stringify(accessTokenSettings));
const putRefreshTokenSettings = async (refreshTokenSettings) => await AsyncStorage.setItem("refreshTokenSettings", JSON.stringify(refreshTokenSettings));

const pickAccessTokenSettings = async () => JSON.parse(await AsyncStorage.getItem("accessTokenSettings"));
const pickRefreshTokenSettings = async () => JSON.parse(await AsyncStorage.getItem("refreshTokenSettings"));

const eraseAccessTokenSettings = async () => await AsyncStorage.removeItem("accessTokenSettings");
const eraseRefreshTokenSettings = async () => await AsyncStorage.removeItem("refreshTokenSettings");

const pickBearerAccessToken = async () => {
  const accessTokenSettings = await pickAccessTokenSettings();
  return `Bearer ${accessTokenSettings.access_Token}`;
};
const pickBearerRefreshToken = async () => {
  const refreshTokenSettings = await pickRefreshTokenSettings();
  return `Bearer ${refreshTokenSettings.access_Token}`;
};
const pickAccessTokenExpiresSec = async () => {
  const accessTokenSettings = await pickAccessTokenSettings();
  return accessTokenSettings.expires_in;
};
const pickRefreshTokenExpiresSec = async () => {
  const refreshTokenSettings = await pickRefreshTokenSettings();
  return refreshTokenSettings.expires_in;
};



export const authService = {
  login,
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
