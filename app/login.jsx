// path for login auth0
export default function Login() {
  setCookie('login', 'true');
  console.log(getCookie('login'));
  return <a href="/api/auth/login">Login</a>;
}
