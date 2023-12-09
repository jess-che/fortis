// path for logout auth0
export default function Logout() {
  setCookie('login', 'false');
  setCookie('units', 'Imperial');
  setCookie('log', 'false');
  setCookie('uid', 'none');
  return <a href="/api/auth/logout">Logout</a>;
}
