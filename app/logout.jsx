// path for logout auth0
export default function Logout() {
  setCookie('login', 'false');
  return <a href="/api/auth/logout">Logout</a>;
}
