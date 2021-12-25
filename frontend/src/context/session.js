import Cookies from 'js-cookie';

export function getAuthToken(token) {
  return Cookies.get('jwt_token');
}

export function setAuthToken(token) {
  return Cookies.set('jwt_token', token);
}

export function clearAuthToken(token) {
  Cookies.remove('jwt_token');
}

export function authTokenToUserInfo(token) {
  return { 
    id: token.toString(),
  };
}
