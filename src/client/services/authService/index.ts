
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user') as string);
    console.log('user in auth', user)
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}