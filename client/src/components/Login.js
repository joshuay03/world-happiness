import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const URL = 'http://131.181.190.87:3000/user/login';
  const [status, setStatus] = useState({
    token: localStorage.getItem("token"),
    retry: false,
    redirect: false
  });
  const [alert, setAlert] = useState("");
  const login = e => {
    e.preventDefault();
    fetch(URL, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        setAlert(res.message);
        setStatus({...status, retry: true});
      }
      else {
        localStorage.setItem("token", res.token);
        setStatus({...status, token: res.token, retry: false, redirect: true});
      }
    });
  }
  if (status.token === null || status.retry) {
    return (
      <div className="grid place-items-center">
        <form onSubmit={login}>
          <div className="grid grid-rows-4 space-y-3 place-items-center -mt-52">
            <label>{ alert }</label>
            <label className="text-6xl">Login</label>
            <input className="text-lg w-96 h-12 rounded-md pl-2"
              type="text"
              name="email"
              value={ user.email }
              placeholder= "Email"
              onChange={e => setUser({ ...user, email: e.target.value })}
            />
            <input className="text-lg w-96 h-12 rounded-md pl-2"
              type="text"
              name="password"
              value={ user.password }
              placeholder= "Password"
              onChange={e => setUser({ ...user, password: e.target.value })}
            />
            <button className="bg-blue-100 rounded-md px-5 pb-2 pt-3 text-xl mt-4" type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  }
  else {
    if (status.redirect) {
      return (
        <LoggedIn/>
      );
    }
    else {
      return (
        <div className="text-3xl max-w-5xl -mt-32">
          <label>Already logged in!</label>
        </div>
      );
    }
  }
}

export function LoggedIn() {
  const [redirect, setRedirect] = useState({
    now: false
  });

  useEffect(() => {
    setTimeout(() => {
      setRedirect({ ...redirect, now: true });
    }, 2000)
  })

  if (redirect.now) {
    return (
      <Redirect to="/home" />
    );
  }
  else {
    return (
      <div className="text-3xl max-w-5xl -mt-32">
        <label>Login successful! Taking you to the to Home page...</label>
      </div>
    );
  }
}

export function Logout() {
  if (localStorage.getItem("token") !== null) {
    localStorage.removeItem("token")
  }

  return (
    <Redirect to="/home"/>
  );
}