import wsmosy from '../api/wsmosy';
import { ThemeConsumer } from 'react-native-elements';


export const AuthService = () => {

};

function login(username, password) {
  return wsmosy
    .post("token", { username, password })
    .then(handleResponse)
}



// LOCALS
function handleResponse(response) {
  const data = response.data;
  if (response.data !== 200) {
    if (response.status === 401) {
      logout();
    }
    const err = data || response.status.text;
    throw new Error(err);
  }

  return data !== undefined ? data : true;
}