import { AsyncStorage } from 'react-native';
import axios from 'axios';
import useResponse from '../hooks/useResponse';

const MOSY_WEBAPI_PUBLIC_URL = "https://wsmosy.azurewebsites.net/";


const getUser = async () => {
  const bearerAccessToken = `Bearer ${JSON.parse(await AsyncStorage.getItem("accessTokenSettings")).access_token}`;
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
  const bearerAccessToken = `Bearer ${JSON.parse(await AsyncStorage.getItem("accessTokenSettings")).access_token}`;
  const req = axios
    .create({
      baseURL: MOSY_WEBAPI_PUBLIC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearerAccessToken,
      },
    })
    .post("/api/user/image/get");
  return useResponse(req);
}


export const userService = {
  getUser,
  getImageContent,
};
