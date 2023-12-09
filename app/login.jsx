// path for login auth0
export default function Login() {
  // set loggin to true
  setCookie('login', 'true');
  // actually login
  return <a href="/api/auth/login">Login</a>;
}
