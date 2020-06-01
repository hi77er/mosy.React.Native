import { AsyncStorage } from 'react-native';
import axios from 'axios';

import useResponse from '../hooks/useResponse';


const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";
let accessTokenIsBeingRefreshed = false;

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
  accessTokenIsBeingRefreshed = true;
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
  return accessTokenSettings && accessTokenSettings.access_token;
};

const putAccessTokenSettings = async (accessTokenSettings) => {
  const expiresInSec = accessTokenSettings.expires_in;

  const nowUtcTimestamp = getUtcTimestamp();

  const adjustedSeconds = parseInt(expiresInSec * (1 / 6)); // later change that to 2/3 of the time that it actually expires in
  const expiresUtcTimeStamp = new Date(nowUtcTimestamp).setSeconds(adjustedSeconds);
  accessTokenSettings = { ...accessTokenSettings, expires_datetime_utc: new Date(expiresUtcTimeStamp) };

  return await AsyncStorage.setItem("accessTokenSettings", JSON.stringify(accessTokenSettings));
};
const putRefreshTokenSettings = async (refreshTokenSettings) => {
  const expiresInSec = refreshTokenSettings.expires_in;

  const nowUtcTimestamp = getUtcTimestamp();

  const adjustedSeconds = parseInt(expiresInSec * (1 / 6));
  const expiresUtcTimeStamp = new Date(nowUtcTimestamp).setSeconds(adjustedSeconds);
  refreshTokenSettings = { ...refreshTokenSettings, expires_datetime_utc: new Date(expiresUtcTimeStamp) };

  return await AsyncStorage.setItem("refreshTokenSettings", JSON.stringify(refreshTokenSettings));
};

const pickAccessTokenSettings = async () => {
  const settings = await AsyncStorage.getItem("accessTokenSettings");
  const parsed = settings ? JSON.parse(settings) : null;
  return parsed;
};
const pickRefreshTokenSettings = async () => {
  const settings = await AsyncStorage.getItem("refreshTokenSettings");
  const parsed = settings ? JSON.parse(settings) : null;
  return parsed;
};

const eraseAccessTokenSettings = async () => await AsyncStorage.removeItem("accessTokenSettings");
const eraseRefreshTokenSettings = async () => await AsyncStorage.removeItem("refreshTokenSettings");

const pickBearerAccessToken = async () => {
  const settings = await pickAccessTokenSettings();
  return settings ? `Bearer ${settings.access_token}` : null;
};
const pickBearerRefreshToken = async () => {
  const settings = await pickRefreshTokenSettings();
  return settings ? `Bearer ${settings.access_token}` : null;
};
const pickValidBearerAccessToken = async () => {
  const accesTokenHasExpired = await hasAccessTokenExpired();

  if (accesTokenHasExpired) {
    // INFO: When api call queries request a token only the first should call for refreshToken.
    // INFO: The rest will use the old token which indeed is still valid for at least some time
    if (!accessTokenIsBeingRefreshed) {
      const result = await refreshToken();
      if (result && result.accessToken && result.accessToken.access_token && result.refreshToken && result.refreshToken.access_token) {
        await putAccessTokenSettings(result.accessToken);
        await putRefreshTokenSettings(result.refreshToken);

        accessTokenIsBeingRefreshed = false;
      }
    }
  }

  const settings = await pickAccessTokenSettings();
  return settings ? `Bearer ${settings.access_token}` : null;
};

const pickValidAccessToken = async () => {
  const accesTokenHasExpired = await hasAccessTokenExpired();

  if (accesTokenHasExpired) {
    // INFO: When api call queries request a token only the first should call for refreshToken.
    // INFO: The rest will use the old token which indeed is still valid for at least some time
    if (!accessTokenIsBeingRefreshed) {
      const result = await refreshToken();
      if (result && result.accessToken && result.accessToken.access_token && result.refreshToken && result.refreshToken.access_token) {
        await putAccessTokenSettings(result.accessToken);
        await putRefreshTokenSettings(result.refreshToken);

        accessTokenIsBeingRefreshed = false;
      }
    }
  }

  const settings = await pickAccessTokenSettings();
  return settings ? settings.access_token : null;
};

const pickAccessTokenExpiresSec = async () => {
  const settings = await pickAccessTokenSettings();
  return settings ? settings.expires_in : null;
};
const pickRefreshTokenExpiresSec = async () => {
  const settings = await pickRefreshTokenSettings();
  return settings ? settings.expires_in : null;
};

const pickAccessTokenExpiresUtc = async () => {
  const settings = await pickAccessTokenSettings();
  return settings ? settings.expires_datetime_utc : null;
};
const pickRefreshTokenExpiresUtc = async () => {
  const settings = await pickRefreshTokenSettings();
  return settings ? settings.expires_datetime_utc : null;
};

const hasAccessTokenExpired = async () => {
  const expiresUtc = await pickAccessTokenExpiresUtc();
  return Date.parse(getNowUtc()) > Date.parse(expiresUtc);
};
const hasRefreshTokenExpired = async () => {
  const expiresUtc = await pickRefreshTokenExpiresUtc();
  return Date.parse(getNowUtc()) > Date.parse(expiresUtc);
};

const getNowUtc = () => {
  const now = new Date();
  const nowUtcTimestamp = getUtcTimestamp();

  return new Date(nowUtcTimestamp);
};

const getUtcTimestamp = () => {
  const now = new Date();
  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds()
  );
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
  pickValidAccessToken,
  pickValidBearerAccessToken,
  pickAccessTokenExpiresSec,
  pickRefreshTokenExpiresSec,
  pickAccessTokenExpiresUtc,
  pickRefreshTokenExpiresUtc,
  hasAccessTokenExpired,
  hasRefreshTokenExpired
};
