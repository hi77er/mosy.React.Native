import { AsyncStorage } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

import { navigate } from '../navigationRef';
import createDataContext from './createDataContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const userReducer = (state, action) => {
  let result = state;

  switch (action.type) {
    case 'clearUser':
      result = { ...state, user: null, };
      break;
    case 'loadUser':
      result = {
        ...state,
        user: action.payload,
        selectedOperationalVenue: action.payload
          && action.payload.fboUserRoles
          && action.payload.fboUserRoles.length
          && action.payload.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator').length
          ? action.payload.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator')[0].fbo
          : null,
        tableAccountsOperatorVenuesCount: action.payload
          && action.payload.fboUserRoles
          && action.payload.fboUserRoles.length
          && action.payload.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator').length
          ? action.payload.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator').length
          : null,
      };
      break;
    case 'setOperationalVenue':
      const selectedVenue = state.user.fboUserRoles.filter(x => x.fbo.name == action.payload)[0].fbo;
      result = { ...state, selectedOperationalVenue: selectedVenue };
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

const clearUser = (dispatch) => {
  return async () => {
    dispatch({ type: 'clearUser' });
  };
};

const loadUser = (dispatch) => {
  return async () => {
    let user = await userService.getUser();
    dispatch({ type: 'loadUser', payload: user });
  };
};

const loadUserImageContent = (dispatch) => {
  return async (size) => {
    const imageContent = await userService.getImageContent(size);

    if (imageContent)
      dispatch({ type: 'loadImageContent', payload: { imageContent: imageContent.base64Content, size } });
  };
};

const setOperationalVenue = (dispatch) => {
  return async (venue) => {

    dispatch({ type: 'setOperationalVenue', payload: venue });
  };
};

export const { Provider, Context } = createDataContext(
  userReducer,
  {
    clearUser,
    loadUser,
    loadUserImageContent,
    setOperationalVenue,
  },
  {
    user: null,
    selectedOperationalVenue: null,
    tableAccountsOperatorVenuesCount: 0,
  },
);
