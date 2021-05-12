import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const URL = 'http://131.181.190.87:3000/user/login';
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [alert, setAlert] = useState('');

  const login = (e) => {
    e.preventDefault();
    fetch(URL, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(function(res) {
        if (res.status === 401) {
          setAlert('Incorrect email address or password');
        } else if (res.status === 400) {
          setAlert('Both email address and password are required')
        } else {
          res.json()
            .then((obj) => {
              localStorage.setItem('token', obj.token);
              setToken(obj.token);
            });
        }
      });
  };

  if (token === null) {
    return (
      <div className="mt-10">
        <form onSubmit={login}>
          <div className="h-auth grid grid-rows-5 place-items-center">
            <label className="text-3xl text-red-600">{alert}</label>
            <label className="text-6xl text-gray-200">Login</label>
            <input
              className="text-lg w-96 h-12 rounded-md pl-2"
              type="text"
              name="email"
              value={user.email}
              placeholder="Email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              className="text-lg w-96 h-12 rounded-md pl-2 -mt-14"
              type="text"
              name="password"
              value={user.password}
              placeholder="Password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button className="bg-blue-100 rounded-md px-5 pb-2 pt-3 text-xl -mt-16" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return <LoggedIn />;
  }
}

export function LoggedIn() {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.goBack();
    }, 1000);
  });

  return (
    <div className="grid place-items-center mt-16">
      <label className="text-3xl text-gray-200">Login successful! Taking you back...</label>
    </div>
  );
}

export function Logout() {
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      localStorage.removeItem('token');
    }

    setTimeout(() => {
      history.goBack();
    }, 1000);
  });

  return (
    <div className="grid place-items-center mt-16">
      <label className="text-3xl text-gray-200">Logging you out...</label>
    </div>
  );
}
