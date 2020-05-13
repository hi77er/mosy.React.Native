import { AsyncStorage } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

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
    case 'signup':

      break;
    case 'loadImageContent':
      const { imageContent, size } = action.payload;
      const user = state.user;
      let profileImage = null;

      switch (size) {
        case 0:
          profileImage = { ...user.profileImage, base64Original: imageContent, };
          break;
        case 1:
          profileImage = { ...user.profileImage, base64x100: imageContent, };
          break;
        case 2:
          profileImage = { ...user.profileImage, base64x200: imageContent, };
          break;
        case 3:
          profileImage = { ...user.profileImage, base64x300: imageContent, };
          break;
      }

      result = { ...state, user: { ...user, profileImage }, };
  }

  return result;
};

const signin = (dispatch) => {
  return async ({ email, password }) => {
    await handleSignIn(dispatch, { email, password });
  };
};

const signup = (dispatch) => {
  return async ({ email, password }) => {
    try {
      if (!email || !password)
        dispatch({ type: 'add_error', payload: "Email and pass are required!" });
      else {
        const result = await authService.signup(email, password);
        dispatch({ type: 'signup', payload: { ...result } });
      }
    }
    catch {
      dispatch({ type: "add_error", payload: "Something went wrong." });
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

const signoutUser = (dispatch) => {
  return async () => {
    await authService.eraseAccessTokenSettings();
    await authService.eraseRefreshTokenSettings();
    await handleSignIn(dispatch, { email: MOSY_WEBAPI_USER, password: MOSY_WEBAPI_PASS });
    navigate("mainFlow");
  }
};

const loadUserImageContent = (dispatch) => {
  return async (size) => {
    const imageContent = await userService.getImageContent(size);

    if (imageContent)
      dispatch({ type: 'loadImageContent', payload: { imageContent: imageContent.base64Content, size } });
  };
};

const handleSignIn = async (dispatch, { email, password }) => {
  try {
    if (!email || !password)
      dispatch({ type: 'add_error', payload: "Email and pass are required!" });
    else {
      const result = await authService.login(email, password);
      let user = null;
      if (result && result.accessToken && result.accessToken.access_token && result.refreshToken && result.refreshToken.access_token) {
        await authService.putAccessTokenSettings(result.accessToken);
        await authService.putRefreshTokenSettings(result.refreshToken);

        const expiresInSec = await authService.pickAccessTokenExpiresSec();
        const intervalMs = parseInt(expiresInSec * (5 / 6)) * 1000;

        scheduleRefreshToken(intervalMs);

        user = await userService.getUser();

        dispatch({ type: 'signin', payload: { ...result, user } });
      }
    }
  }
  catch {
    dispatch({ type: "add_error", payload: "Something went wrong." });
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signoutUser,
    signup,
    loadUserImageContent,
  },
  {
    errorMessage: "",
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthorized: false,
  },
);
