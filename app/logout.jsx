// path for logout auth0
export default function Logout() {
  // basically unsset all cookies
  setCookie('login', 'false');
  setCookie('units', 'Imperial');
  setCookie('log', 'false');
  setCookie('uid', 'none');
  // actual path to logout
  return <a href="/api/auth/logout">Logout</a>;
}
