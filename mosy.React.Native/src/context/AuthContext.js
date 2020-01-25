import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';

const authReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'add_error':
      result = { ...state, errorMessage: action.payload, isAuthorized: false };
      break;
    case 'signin':
      result = { ...state, token: action.payload, isAuthorized: true }
      break;
    case 'signout':
      result = { ...state, token: null, isAuthorized: false }
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
        const response = "the Token that the API returns";
        const isOperator = true;

        await AsyncStorage.setItem("token", response);
        dispatch({ type: 'signin', payload: response });

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
    await AsyncStorage.removeItem("token");
    dispatch({ type: "signout" });
    navigate("mainFlow");
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout },
  {
    errorMessage: "",
    token: null,
    isAuthorized: false,
  }
);