import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const authReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'add_error':
      result = { ...state, errorMessage: action.payload, isAuthorized: false };
      break;
    case 'signin':
      result = {
        ...state,
        accessToken: action.payload.accessToken.access_token,
        refreshToken: action.payload.refreshToken.access_token,
        user: action.payload.user,
        isAuthorized: true
      };
      break;
    case 'signout':
      result = {
        ...state,
        accessToken: null,
        refreshToken: null,
        isAuthorized: false
      };
      break;
  }
  return result;
};

const signin = (dispatch) => {
  return async ({ email, password }) => {
    try {
      if (!email || !password)
        dispatch({ type: 'add_error', payload: "Email and pass are required!" });
      else {
        const result = await authService.login(email, password);
        let user = null;
        if (result && result.accessToken && result.accessToken.access_token && result.refreshToken && result.refreshToken.access_token) {
          await authService.putAccessTokenSettings(result.accessToken);
          await authService.putRefreshTokenSettings(result.refreshToken);

          user = await userService.getUser();

          const expiresInSec = await authService.pickAccessTokenExpiresSec();
          const intervalMs = parseInt(expiresInSec * (5 / 6)) * 1000;

          scheduleRefreshToken(intervalMs);

          dispatch({ type: 'signin', payload: { ...result, user } });
        }
      }
    }
    catch {
      dispatch({
        type: "add_error",
        payload: "Something went wrong.",
      });
    }
  };
};

const scheduleRefreshToken = (intervalMs) => {
  // INFO: if the app is suspended the app won't fire until it gets resumed
  // INFO: which in the current scenario is cool
  // INFO: but might not be this cool if we need something to happen even if our app is suspended
  setInterval(async () => {
    const result = await authService.refreshToken();
    if (result && result.accessToken && result.accessToken.access_token && result.refreshToken && result.refreshToken.access_token) {
      await authService.putAccessTokenSettings(result.accessToken);
      await authService.putRefreshTokenSettings(result.refreshToken);
    }
  }, intervalMs);
};

const signout = (dispatch) => {
  return async () => {
    await authService.eraseAccessTokenSettings();
    await authService.eraseRefreshTokenSettings();
    dispatch({ type: "signout" });
    navigate("mainFlow");
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout },
  {
    errorMessage: "",
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthorized: false,
  },
);
