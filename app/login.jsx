// path for login auth0
export default function Login() {
  setCookie('login', 'true');
  return <a href="/api/auth/login">Login</a>;
}
