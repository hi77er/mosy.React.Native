import { AsyncStorage } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { authService } from '../services/authService';

const authReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'add_error':
      result = {
        ...state,
        errorMessage: action.payload,
        signinSuccess: false,
        signupSuccess: false,
        signoutSuccess: false
      };
      break;
    case 'signin':
      result = {
        ...state,
        accessToken: action.payload.accessToken.access_token,
        refreshToken: action.payload.refreshToken.access_token,
        signinSuccess: true,
        signupSuccess: false,
        signoutSuccess: action.payload.signoutSuccess,
      };
      break;
    case 'signupClear':
      result = {
        ...state,
        signinSuccess: false,
        signupSuccess: false,
        signoutSuccess: false,
        message: null
      };
      break;
    case 'signinClear':
      result = {
        ...state,
        signinSuccess: false,
        signupSuccess: false,
        signoutSuccess: false,
      };
      break;
    case 'signup':
      result = {
        ...state,
        signinSuccess: false,
        signupSuccess: true,
        signoutSuccess: false,
        message: "Done! Confirm your email, please.",
      };
      break;
  }

  return result;
};

const signin = (dispatch) => {
  return async ({ email, password }) => {
    await handleSignin(dispatch, { email, password, signoutSuccess: false });
  };
};

const signup = (dispatch) => {
  return async ({ email, password, confirmPassword }) => {
    if (!email || !password)
      dispatch({ type: 'add_error', payload: "Email and pass are required!" });
    else if (password != confirmPassword)
      dispatch({ type: 'add_error', payload: "Passwords should match!" });
    else {
      const result = await authService
        .signup(email, password, confirmPassword)
        .catch((err) => {
          let message = "Something went wrong!";
          if (err && err.response && err.response.data && err.response.data.errorMessage)
            message = err.response.data.errorMessage;
          else
            console.log(err.response ? err.response : err);

          dispatch({ type: 'add_error', payload: message });
        });

      if (result && result.isSuccessful)
        dispatch({ type: 'signup' });
    }
  };
};


const signupClear = (dispatch) => {
  return async () => {
    dispatch({ type: 'signupClear' });
  };
};

const signinClear = (dispatch) => {
  return async () => {
    dispatch({ type: 'signinClear' });
  };
};

const signoutUser = (dispatch) => {
  return async () => {
    await authService.eraseAccessTokenSettings();
    await authService.eraseRefreshTokenSettings();
    await handleSignin(dispatch, { email: MOSY_WEBAPI_USER, password: MOSY_WEBAPI_PASS, signoutSuccess: true });
  }
};

const handleSignin = async (dispatch, { email, password, signoutSuccess }) => {
  try {
    if (!email || !password)
      dispatch({ type: 'add_error', payload: "Email and pass are required!" });
    else {
      const result = await authService
        .login(email, password)
        .catch((err) => {
          let message = "Something went wrong!";
          if (err && err.response && err.response.data && err.response.data.errorMessage)
            message = err.response.data.errorMessage;
          else
            console.log(err.response ? err.response : err);

          dispatch({ type: 'add_error', payload: message });
        });

      if (result && result.accessToken && result.accessToken.access_token && result.refreshToken && result.refreshToken.access_token) {
        await authService.putAccessTokenSettings(result.accessToken);
        await authService.putRefreshTokenSettings(result.refreshToken);

        dispatch({ type: 'signin', payload: { ...result, signoutSuccess } });
      }
    }
  }
  catch {
    dispatch({ type: "add_error", payload: "Something went wrong!" });
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signoutUser,
    signup,
    signupClear,
    signinClear,
  },
  {
    errorMessage: "",
    accessToken: null,
    refreshToken: null,
    signinSuccess: false,
    signupSuccess: false,
  },
);
