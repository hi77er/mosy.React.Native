import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { authService } from '../services/authService';

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
  return async ({ email, pass }) => {
    try {
      if (!email || !pass)
        dispatch({ type: 'add_error', payload: "Email and pass are required!" });
      else {

        // const response = make API call 
        const result = await authService.login(email, pass);
        console.log(result);

        const isOperator = true;
        if (result.accessToken && result.accessToken.access_token && result.refreshToken && result.refreshToken.access_token) {
          await AsyncStorage.setItem("accessToken", result.accessToken.access_token);
          await AsyncStorage.setItem("refreshToken", result.refreshToken.access_token);
        }

        dispatch({ type: 'signin', payload: result });

        if (isOperator) navigate("mainOperatorFlow");
        else navigate("mainAuthorizedFlow");
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

const signout = (dispatch) => {
  return async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
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
    isAuthorized: false,
  }
);